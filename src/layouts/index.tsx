import { Outlet } from 'umi';
import { Toast } from 'antd-mobile';
import { useEffect, useState } from 'react';
import Header from '@/components/Header'
import styles from './index.less';
import mockLogin from '@/utils/mockLogin';

export default function Layout() {

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    mockLogin()
    .then(() => {
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    Toast.config({ duration: 500 });
  }, []);

  return (
    <div className={styles['score-app']}>
      <Header />
      <div className={styles['score-app-main']}>
        <div className={styles['score-app-main-content']}> 
          {
            !loading && <Outlet />
          }
        </div>
      </div>
    </div>
  );
}
