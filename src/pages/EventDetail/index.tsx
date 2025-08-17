import { history } from 'umi';
import { useCallback, useState, useEffect } from 'react';
import classnames from 'classnames';
import { CameraOutline } from 'antd-mobile-icons';
import { getTimeList } from '@/services/base';
import { hasDays } from '@/utils/tool'
import styles from './index.less';
import dayjs from 'dayjs';
import { FloatingBubble, Swiper } from 'antd-mobile';

let CurrentEvent: API_TIME.GetTimeListData | false = false

export function setCurrentEvent(event: API_TIME.GetTimeListData | false) {
  CurrentEvent = event 
}

const EventDetail = () => {
  const eventData = (history.location.state || {}) as API_TIME.GetTimeListData;
  if(!CurrentEvent) {
    CurrentEvent = eventData
  }

  const { _id } = CurrentEvent;

  const [dataSource, setDataSource] = useState<API_TIME.GetTimeListData[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  const handleClick = useCallback(() => {
    history.push('/image-list', dataSource[index]);
  }, [dataSource, index]);

  const handleEdit = useCallback(() => {
    history.push('/event-edit', dataSource[index]);
  }, [dataSource, index]);

  const fetchData = useCallback(async () => {
    return getTimeList({
      currPage: 0,
      pageSize: 999,
    }).then((data) => {
      setDataSource(data.list);
      setIndex(data.list.findIndex((item: any) => item._id === _id))
      setLoading(false);
    });
  }, []);

  useEffect(() => {
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
          setCurrentEvent(dataSource[index])
        }}
        defaultIndex={dataSource.findIndex((item) => item._id === _id)}
      >
        {dataSource.map((item) => {
          const { event_name, start_date, _id } = item;
          return (
            <Swiper.Item key={_id}>
              <div className={classnames(styles['event-detail'])}>
                <div className={styles['event-detail-main']} onClick={handleEdit}>
                  <div className={styles['event-detail-title']}>
                    {event_name}已经
                  </div>
                  <div className={styles['event-detail-content']}>
                    <div>{hasDays(start_date)}</div>
                    <div>
                      起始日：{dayjs(start_date).format('YYYY-MM-DD dddd')}
                    </div>
                  </div>
                </div>
              </div>
            </Swiper.Item>
          );
        })}
      </Swiper>
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
