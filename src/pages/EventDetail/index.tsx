import { history } from 'umi';
import { useCallback } from 'react';
import classnames from 'classnames';
import { CameraOutline } from 'antd-mobile-icons';
import styles from './index.less';
import dayjs from 'dayjs';
import { FloatingBubble } from 'antd-mobile';

const EventDetail = () => {
  const eventData = (history.location.state || {}) as API_TIME.GetTimeListData;
  const { event_name, start_date, _id } = eventData;

  const handleClick = useCallback(() => {
    history.push('/image-list', eventData);
  }, [eventData]);

  const handleEdit = useCallback(() => {
    history.push('/event-edit', eventData);
  }, [eventData]);

  return (
    <div className={classnames(styles['event-detail'])}>
      <div className={styles['event-detail-main']}>
        <div className={styles['event-detail-title']}>{event_name}已经</div>
        <div className={styles['event-detail-content']}>
          <div>{dayjs().diff(dayjs(start_date), 'day')}</div>
          <div>起始日：{dayjs(start_date).format('YYYY-MM-DD dddd')}</div>
        </div>
      </div>
      <FloatingBubble
        style={{
          '--initial-position-bottom': '128px',
          '--initial-position-right': '24px',
          '--edge-distance': '24px',
        }}
        onClick={handleClick}
      >
        <CameraOutline fontSize={32} />
      </FloatingBubble>
    </div>
  );
};

export default EventDetail;
