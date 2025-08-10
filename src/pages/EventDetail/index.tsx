import { history } from 'umi';
import { useCallback } from 'react';
import { CameraOutline } from 'antd-mobile-icons'
import styles from './index.less';
import Header from '@/components/Header';
import dayjs from 'dayjs';
import { Button } from 'antd-mobile';

const EventDetail = () => {

  const eventData = (history.location.state || {}) as API_TIME.GetTimeListData
  const {  
    event_name,
    start_date,
    _id,
  } = eventData

  const handleClick = useCallback(() => {
    history.push('/image-list', eventData);
  }, [eventData]);

  const handleEdit = useCallback(() => {
    history.push('/event-edit', eventData);
  }, [eventData]);

  return (
    <div className={styles['event-detail']}>
      <Header rightNode={(
        <Button color="primary" onClick={handleEdit}>编辑</Button>
      )} />
      <div className={styles['event-detail-main']}>
        <div className={styles['event-detail-title']}>
          {event_name}已经
        </div>
        <div className={styles['event-detail-content']}>
          <div>
            {dayjs().diff(dayjs(start_date), 'day')}
          </div>
          <div>
            起始日：{dayjs(start_date).format('YYYY-MM-DD dddd')}
          </div>
        </div>
      </div>
      <div className={styles['event-detail-footer']}>
        <CameraOutline onClick={handleClick} />
      </div>
    </div>

  );
};

export default EventDetail;
