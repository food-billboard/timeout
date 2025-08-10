import { Outlet, history } from 'umi';
import { Toast, Avatar } from 'antd-mobile';
import { useCallback, useEffect, useState } from 'react';
import { Emitter } from '@/utils/routeListener'
import { getUserInfo as getUserInfoData } from '@/utils/constants';
import styles from './index.less';
import mockLogin from '@/utils/mockLogin';

export default function Layout() {

  const [activeKey, setActiveKey] = useState('/');
  const [loading, setLoading] = useState(true)

  const { username, score, avatar } = getUserInfoData();

  const onRouteChange = useCallback((key: string) => {
    history.push(key);
  }, []);

  useEffect(() => {
    mockLogin()
    .then(() => {
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    function listener() {
      const currentKey = history.location.pathname
      setActiveKey(currentKey);
    }
    Emitter.addListener('route-change', listener)
    listener()
    return () => {
      Emitter.removeListener('route-listener')
    }
  }, []);

  useEffect(() => {
    Toast.config({ duration: 500 });
  }, []);

  return (
    <div className={styles['score-app']}>
      <div className={styles['score-app-main']}>
        <div className={styles['score-app-main-header']}>
          <div className={styles['score-app-main-header-username']}>
            <Avatar
              src={avatar}
              style={{ '--size': '48px', marginRight: '.5em' }}
            />
            {username}
          </div>
          <div className={'star j-c'}>
            <div></div>
            <div>{score}</div>
          </div>
          <div className="t-r">x</div>
        </div>
        <div className={styles['score-app-main-content']}> 
          {
            !loading && <Outlet />
          }
        </div>
      </div>
    </div>
  );
}
