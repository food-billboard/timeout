import {
  InfiniteScroll,
  Tabs,
  Grid,
  FloatingBubble,
  Steps,
  Button,
} from 'antd-mobile';
import { ReactNode, useCallback, useState } from 'react';
import { history } from 'umi';
import { AddOutline } from 'antd-mobile-icons';
import { getImageList, postImage } from '@/services/base';
import styles from './index.less';
import Header from '@/components/Header';
import { useGetState } from 'ahooks';
import EXIF from 'exif-js';
import dayjs from 'dayjs';
import { uploadFile } from '@/utils/Upload';

export const ImageGrid = (props: {
  extra?: ReactNode;
  value: API_TIME.GetTimeImageListData;
  onClick?: (value: API_TIME.GetTimeImageListData) => void;
}) => {
  const { value, extra, onClick } = props;

  const { _id, image, create_date, start_date } = value;

  return (
    <div
      onClick={onClick?.bind(null, value)}
      key={_id}
      className={styles['image-list-item']}
    >
      <div>
        <img src={image} />
        <div className={styles['image-list-item-info']}>
          <div>{dayjs(create_date).diff(start_date, 'day')}</div>
          <div>{dayjs(create_date).format('YYYY-MM-DD')}</div>
        </div>
        {extra}
      </div>
    </div>
  );
};

const ImageList = () => {
  const { _id, event_name, start_date } = (history.location.state ||
    {}) as API_TIME.GetTimeListData;

  const [dataSource, setDataSource] = useState<API_TIME.GetTimeImageListData[]>(
    [
      {
        _id: 'string',
        event: 'string',
        event_name: 'string',
        start_date: 'string',
        description: 'string',
        image:
          'https://t8.baidu.com/it/u=3032461838,1625380434&fm=217&app=126&size=re3,2&q=75&n=0&g=3n&f=JPEG&fmt=auto&maxorilen2heic=2000000?s=E9C0A3464AA5936E487CE40D030070C2',
        image_id: 'string',
        createdAt: 'string',
        updatedAt: 'string',
        create_date: 'string',
      },
      {
        _id: 'string1',
        event: 'string',
        event_name: 'string',
        start_date: 'string',
        description: 'string',
        image:
          'https://t8.baidu.com/it/u=3032461838,1625380434&fm=217&app=126&size=re3,2&q=75&n=0&g=3n&f=JPEG&fmt=auto&maxorilen2heic=2000000?s=E9C0A3464AA5936E487CE40D030070C2',
        image_id: 'string2',
        createdAt: 'string',
        updatedAt: 'string',
        create_date: 'string',
      },
    ],
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore, getHasMore] = useGetState(true);
  const [_, setCurrPage, getCurrPage] = useGetState(-1);
  const [activeKey, setActiveKey] = useState('all');

  const fetchData = useCallback(async (reset: boolean = false) => {
    const currPage = getCurrPage();
    const newCurrPage = reset ? 0 : currPage + 1;
    setCurrPage(newCurrPage);
    return getImageList({
      event: _id,
      currPage: newCurrPage,
      pageSize: 10,
    }).then((data) => {
      setDataSource((prev) => {
        if (reset) return data.list;
        return [...prev, ...data.list];
      });
      setHasMore(data.list.length === 10);
    });
  }, []);

  const handleImageDetail = useCallback(
    (item: API_TIME.GetTimeImageListData) => {
      return history.push('/image-detail', item);
    },
    [],
  );

  const handleUpload = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const metaData: any = {
      description: '',
      event: _id,
    };
    uploadFile({
      accept: 'image/*',
      callback: () => {
        var reader = new FileReader();
        reader.onload = function (event: any) {
          var data = event.target.result;
          EXIF.getData(metaData.file, function () {
            var allMetadata = EXIF.getAllTags(metaData.file);
            postImage({
              ...metaData,
              create_date:
                allMetadata.DateTimeOriginal || dayjs().format('YYYY-MM-DD'),
            })
              .then(() => {})
              .catch((err) => {})
              .then(() => {
                setLoading(false);
                fetchData(true);
              });
          });
        };
        reader.readAsDataURL(metaData.file); // 以 Data URL 的形式读取文件内容
      },
      uploadEnd: (fileId) => {
        metaData.image = fileId;
      },
      upload: (file) => {
        metaData.file = file;
      },
    });
  }, [loading]);

  return (
    <div className={styles['image-list']}>
      <Header
        rightNode={
          <Button
            onClick={() =>
              history.push('/image-delete', {
                event: _id,
              })
            }
          >
            管理
          </Button>
        }
      />
      <div className={styles['image-list-wrapper']}>
        <div className={styles['image-list-title']}>
          <div className={styles['image-list-title-left']}>
            <div>{event_name}已经</div>
            <div>{dayjs(start_date).format('YYYY-MM-DD dddd')}</div>
          </div>
          <div className={styles['image-list-title-right']}>
            {dayjs().diff(dayjs(start_date), 'day')}
          </div>
        </div>
        <div className={styles['image-list-main']}>
          <div className={styles['image-list-main-header']}>
            <Tabs activeKey={activeKey} onChange={setActiveKey}>
              <Tabs.Tab title="全部" key="all">
                <Grid columns={3} gap={8} style={{ backgroundColor: 'white' }}>
                  {dataSource.map((item) => {
                    const { _id, image, create_date } = item;
                    return (
                      <Grid.Item key={_id}>
                        <ImageGrid value={item} onClick={handleImageDetail} />
                      </Grid.Item>
                    );
                  })}
                </Grid>
              </Tabs.Tab>
              <Tabs.Tab title="时间轴" key="timeline">
                <Steps
                  direction="vertical"
                  style={{ backgroundColor: 'white' }}
                >
                  {dataSource.map((item) => {
                    const { _id, image, create_date } = item;
                    return (
                      <Steps.Step
                        key={_id}
                        title={dayjs(create_date).format('YYYY-MM-DD')}
                        status="process"
                        description={
                          <div
                            className={
                              styles['image-list-main-content-timeline']
                            }
                          >
                            <div className={styles['image-list-main-content-timeline-info']}>
                              <div>{event_name}已经</div>
                              <div>
                                {dayjs(create_date).diff(
                                  dayjs(start_date),
                                  'day',
                                )}
                              </div>
                            </div>
                            <div>
                              <img
                                src={image}
                                onClick={handleImageDetail.bind(null, item)}
                              />
                            </div>
                          </div>
                        }
                      />
                    );
                  })}
                </Steps>
              </Tabs.Tab>
            </Tabs>
          </div>
          <div className={styles['image-list-main-content']}></div>
        </div>
        <FloatingBubble
          style={{
            '--initial-position-bottom': '24px',
            '--initial-position-right': '24px',
            '--edge-distance': '24px',
          }}
          onClick={handleUpload}
          axis="xy"
          magnetic="x"
        >
          <AddOutline fontSize={32} />
        </FloatingBubble>
        <InfiniteScroll loadMore={fetchData.bind(false)} hasMore={hasMore} />
      </div>
    </div>
  );
};

export default ImageList;
