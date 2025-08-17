import { SearchBar } from 'antd-mobile';
import { history } from 'umi';
import classnames from 'classnames'
import { useCallback, useEffect, useRef, useState } from 'react';
import { getTimeList } from '@/services/base';
import { hasDays } from '@/utils/tool'
import { setCurrentEvent } from '../EventDetail'
import styles from './index.less';

const PageHome = () => {
  const [dataSource, setDataSource] = useState<API_TIME.GetTimeListData[]>([]);

  const searchContent = useRef('');

  const handleClick = useCallback((item: API_TIME.GetTimeListData) => {
    setCurrentEvent(false)
    history.push('/event-detail', item)
  }, []);

  const fetchData = useCallback(async (reset: boolean = false) => {
    return getTimeList({
      content: searchContent.current,
      currPage: 0,
      pageSize: 999,
    }).then((data) => {
      setDataSource((prev) => {
        if (reset) return data.list;
        return [...prev, ...data.list];
      });
    });
  }, []);

  useEffect(() => {
    fetchData(true);
  }, []);

  return (
    <div className={classnames(styles['home'])}>
      <div className={styles['home-title']}>
        <SearchBar
          placeholder="请输入内容"
          showCancelButton
          onSearch={(val) => {
            searchContent.current = val;
            fetchData(true);
          }}
        />
      </div>
      <div className={styles['home-list']}>
        {dataSource.map((item) => {
          const { start_date, event_name, _id } = item;
          return (
            <div
              onClick={handleClick.bind(null, item)}
              key={_id}
              className={styles['home-list-item']}
            >
              <div className={styles['home-list-item-title']}>
                {event_name}已经
              </div>
              <div className={styles['home-list-item-extra']}>
                <div className={styles['home-list-item-number']}>
                  {hasDays(start_date)}
                </div>
                <div className={styles['home-list-item-unit']}>天</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PageHome;
