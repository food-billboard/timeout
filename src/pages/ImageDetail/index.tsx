import { FloatingBubble, Grid, Modal, Popup, Toast } from 'antd-mobile';
import { history } from 'umi';
import {
  DeleteOutline,
  EditSOutline,
  AppstoreOutline,
} from 'antd-mobile-icons';
import { useEffect, useState } from 'react';
import ImageView from '../ImageList/ImageView';
import { deleteImage, getImageList } from '@/services/base';
import styles from './index.less';
import dayjs from 'dayjs';

const ImageDetail = () => {
  const imageData = history.location.state as API_TIME.GetTimeImageListData;
  const { _id, image, image_id, event, event_name, start_date } = imageData;

  const [imageState, setImageState] = useState(imageData);
  const { create_date } = imageState;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function fetchData() {
      getImageList({
        currPage: 0,
        pageSize: 999,
        _id: image_id,
        event,
      }).then((data) => {
        const [target] = data.list || [];
        setImageState((prev) => {
          return {
            ...prev,
            ...(target || {}),
          };
        });
      });
    }
    fetchData();
  }, [image_id, event]);

  return (
    <div className={styles['image-detail']}>
      <div className={styles['image-detail-content']}>
        <ImageView src={image} />
        <div className={styles['image-detail-content-label']}>
          <div className={styles['image-detail-content-label-left']}>
            <div>{event_name}已经</div>
            <div>SINCE：{dayjs(start_date).format('YYYY-MM-DD')}</div>
          </div>
          <div className={styles['image-detail-content-label-right']}>
            <div>{dayjs(create_date).diff(dayjs(start_date), 'day')}</div>
            <div>DAYS</div>
          </div>
        </div>
      </div>
      <div className={styles['image-detail-footer']}>
        <div className={styles['image-detail-footer-header']}>
          <span>{event_name}</span>
          <span>
            已经
            <span>{dayjs(create_date).diff(dayjs(create_date), 'day')}</span>天
          </span>
        </div>
        <div className={styles['image-detail-footer-sub']}>
          拍摄于：{dayjs(create_date).format('YYYY-MM-DD')}
        </div>
      </div>
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
                    history.push('/image-edit', imageState);
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
                            _id,
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
  );
};

export default ImageDetail;
