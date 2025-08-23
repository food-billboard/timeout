import {
  InfiniteScroll,
  Tabs,
  Grid,
  FloatingBubble,
  Steps,
  ImageUploader,
} from 'antd-mobile';
import { ReactNode, useCallback, useState, useRef, useEffect } from 'react';
import { history, KeepAlive } from 'umi';
import classnames from 'classnames';
import { AddOutline } from 'antd-mobile-icons';
import type { ImageUploaderRef } from 'antd-mobile';
import { getImageList, postImage } from '@/services/base';
import styles from './index.less';
import { useGetState } from 'ahooks';
import exifr from 'exifr';
import dayjs from 'dayjs';
import { pick } from 'lodash';
import { uploadFileWithoutInput } from '@/utils/Upload';
import { hasDays } from '@/utils/tool';
import { setCurrentData } from '../ImageDetail';
import ImageView from './ImageView';

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
        <ImageView src={image} />
        <div className={styles['image-list-item-info']}>
          <div>{hasDays(start_date, create_date)}</div>
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
    [],
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore, getHasMore] = useGetState(true);
  const [_, setCurrPage, getCurrPage] = useGetState(-1);
  const [activeKey, setActiveKey] = useState('all');

  const input = useRef<ImageUploaderRef>(null);
  const prevId = useRef(_id);

  const fetchData = useCallback(
    async (reset: boolean = false) => {
      const currPage = getCurrPage();
      let newCurrPage = reset ? 0 : currPage + 1;
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
    },
    [_id],
  );

  const handleImageDetail = useCallback(
    (item: API_TIME.GetTimeImageListData) => {
      setCurrentData({});
      return history.push('/image-detail', item);
    },
    [],
  );

  const requestUpload = useCallback(
    async (file: any, files: any[]) => {
      if (loading) return null;
      const [lastFile] = files.slice(-1);
      if (file !== lastFile) return null;
      const metaData: any = {
        description: '',
        event: _id,
        image: [],
        files,
      };
      return new Promise<null>((resolve) => {
        uploadFileWithoutInput({
          files,
          callback: async () => {
            for (let index = 0; index < files.length; index++) {
              const file = files[index];
              const allMetadata = await exifr.parse(file);
              await postImage({
                ...pick(metaData, ['description', 'event']),
                image: metaData.image[index],
                create_date:
                  allMetadata.DateTimeOriginal || dayjs().format('YYYY-MM-DD'),
              })
                .then(() => {})
                .catch((err) => {});
            }
            setLoading(false);
            fetchData(true);
            resolve(null);
          },
          uploadEnd: (fileId, index) => {
            metaData.image[index] = fileId;
          },
          upload: (file, index) => {
            setLoading(true);
          },
        });
      });
    },
    [loading],
  );

  const handleUpload = useCallback(() => {
    const nativeInput = input.current?.nativeElement;
    if (nativeInput) {
      nativeInput.click();
    }
  }, []);

  useEffect(() => {
    // 存在缓存需求
    if (prevId.current !== _id) {
      prevId.current = _id;
      fetchData(true)
    }
  }, [_id]);

  return (
    <div className={classnames(styles['image-list'])}>
      <div className={styles['image-list-wrapper']}>
        <div className={styles['image-list-title']}>
          <div className={styles['image-list-title-left']}>
            <div>{event_name}已经</div>
            <div>{dayjs(start_date).format('YYYY-MM-DD dddd')}</div>
          </div>
          <div className={styles['image-list-title-right']}>
            {hasDays(start_date)}
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
                        style={{
                          width: '100%',
                          overflow: 'hidden',
                        }}
                        description={
                          <div
                            className={
                              styles['image-list-main-content-timeline']
                            }
                          >
                            <div
                              className={
                                styles['image-list-main-content-timeline-info']
                              }
                            >
                              <div>{event_name}已经</div>
                              <div>{hasDays(start_date, create_date)}</div>
                            </div>
                            <div>
                              <ImageView
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
      <ImageUploader
        ref={input}
        value={[]}
        multiple
        showUpload={false}
        upload={async () => {
          return {
            url: '',
          };
        }}
        beforeUpload={requestUpload}
      />
    </div>
  );
};

export default () => {
  return (
    <KeepAlive name="image-list" when saveScrollPosition="screen">
      <ImageList />
    </KeepAlive>
  );
};
