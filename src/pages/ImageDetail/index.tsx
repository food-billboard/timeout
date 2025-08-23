import { FloatingBubble, Grid, Modal, Popup, Toast, Swiper } from 'antd-mobile';
import { history, KeepAlive } from 'umi';
import {
  DeleteOutline,
  EditSOutline,
  AppstoreOutline,
} from 'antd-mobile-icons';
import { useEffect, useState } from 'react';
import ImageView from '../ImageList/ImageView';
import { deleteImage, getImageList } from '@/services/base';
import { hasDays } from '@/utils/tool'
import styles from './index.less';
import dayjs from 'dayjs';

let CURRENT_DATA: any = {}
export function setCurrentData(data: any) {
  CURRENT_DATA = {...data}
}

const ImageDetail = () => {
  const imageData = (history.location.state || {}) as API_TIME.GetTimeImageListData;

  if(!CURRENT_DATA._id) {
    CURRENT_DATA = {
      ...imageData
    }
  }

  const { _id, event } = CURRENT_DATA;

  const [dataSource, setDataSource] = useState<API_TIME.GetTimeImageListData[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function fetchData() {
      setLoading(true)
      getImageList({
        currPage: 0,
        pageSize: 999,
        event,
      }).then((data) => {
        setDataSource(data.list)
        setIndex(data.list.findIndex((item: any) => item._id === _id))
        setLoading(false);
      });
    }
    fetchData();
  }, []);

  if (loading) return <></>;

  return (
    <div style={{ height: '100%' }}>
      <Swiper
        style={{ height: '100%' }}
        indicator={() => null}
        onIndexChange={index => {
          setIndex(index)
          setCurrentData(dataSource[index])
        }}
        defaultIndex={index}
      >
        {dataSource.map((item) => {
          const { event_name, start_date, _id, create_date, image } = item;
          return (
            <Swiper.Item key={_id}>
              <div className={styles['image-detail']}>
                <div className={styles['image-detail-content']}>
                  <ImageView src={image} />
                  <div className={styles['image-detail-content-label']}>
                    <div className={styles['image-detail-content-label-left']}>
                      <div>{event_name}已经</div>
                      <div>SINCE：{dayjs(start_date).format('YYYY-MM-DD')}</div>
                    </div>
                    <div className={styles['image-detail-content-label-right']}>
                      <div>{hasDays(start_date, create_date)}</div>
                      <div>DAYS</div>
                    </div>
                  </div>
                </div>
                <div className={styles['image-detail-footer']}>
                  <div className={styles['image-detail-footer-header']}>
                    <span>{event_name}</span>
                    <span>
                      已经
                      <span>{hasDays(start_date, create_date)}</span>天
                    </span>
                  </div>
                  <div className={styles['image-detail-footer-sub']}>
                    拍摄于：{dayjs(create_date).format('YYYY-MM-DD')}
                  </div>
                </div>
              </div>
            </Swiper.Item>
          );
        })}
      </Swiper>
      <FloatingBubble
        style={{
          '--initial-position-bottom': '24px',
          '--initial-position-right': '24px',
          '--edge-distance': '24px',
        }}
        onClick={() => setVisible(true)}
        axis="xy"
        magnetic="x"
      >
        <AppstoreOutline fontSize={32} />
      </FloatingBubble>
      <Popup
        visible={visible}
        position="bottom"
        onClose={() => setVisible(false)}
        closeOnMaskClick
      >
        <div className={styles['action']}>
          <div className={styles['action-header']}>你是否要</div>
          <div className={styles['action-content']}>
            <Grid columns={2} gap={16}>
              {[
                {
                  icon: <EditSOutline />,
                  label: '修改信息',
                  action: () => {
                    history.push('/image-edit', dataSource[index]);
                  },
                },
                {
                  icon: <DeleteOutline />,
                  label: '删除',
                  action: () => {
                    Modal.confirm({
                      content: '是否确定删除',
                      onConfirm: async () => {
                        try {
                          await deleteImage({
                            _id: dataSource[index]._id,
                          });
                          Toast.show({
                            icon: 'success',
                            content: '操作成功',
                            afterClose: () => {
                              history.go(-1);
                            },
                          });
                        } catch (err) {
                          Toast.show({
                            icon: 'fail',
                            content: '操作失败',
                          });
                        }
                      },
                    });
                  },
                },
              ].map((item) => {
                const { label, icon, action } = item;
                return (
                  <Grid.Item key={label}>
                    <div onClick={action} className={styles['action-item']}>
                      {icon}
                      <div>{label}</div>
                    </div>
                  </Grid.Item>
                );
              })}
            </Grid>
          </div>
        </div>
      </Popup>
    </div>
  )
};

export default () => {
  return (
    <KeepAlive name="image-detail" when={false} saveScrollPosition="screen">
      <ImageDetail />
    </KeepAlive>
  )
};
