import { Button } from 'antd-mobile';
import { ReactNode, useCallback } from 'react';
import { history } from 'umi';
import styles from './index.less'

const Header = (props: {
  leftNode?: ReactNode
  centerNode?: ReactNode
  rightNode?: ReactNode 
}) => {

  const { leftNode, rightNode, centerNode } = props 

  const handleBack = useCallback(() => {
    history.replace('/');
  }, []);

  return (
    <div className={styles['header']}>
      <div className={styles['header-left']}>
        {
          leftNode || (
            <Button onClick={handleBack}>返回</Button>
          )
        }
      </div>
      <div className={styles['header-center']}>
        {
          centerNode || '倒数日'
        }
      </div>
      <div className={styles['header-right']}>
        {
          rightNode || (<span></span>)
        }
      </div>
    </div>
  );
};

export default Header;
