import { Button, Toast, Modal } from 'antd-mobile';
import { ReactNode, useCallback, useMemo, useEffect, useState } from 'react';
import { history } from 'umi';
import { Emitter } from '@/utils/routeListener'
import { deleteTime } from '@/services/base'
import styles from './index.less'

const Header = (props: {
  leftNode?: ReactNode
  centerNode?: ReactNode
  rightNode?: ReactNode
}) => {

  const { leftNode, rightNode, centerNode } = props

  const state = (history.location.state || {}) as any
  const {
    _id
  } = state

  const [currentPath, setCurrentPath] = useState('/')

  const handleEditEvent = () => {
    history.push('/event-edit')
  }

  const PATH_HEADER_MAP = useMemo(() => {
    return {
      '/': {
        title: '',
        left: false,
        right: (
          <Button onClick={() => history.push('/event-edit')}>新增</Button>
        )
      },
      '/event-detail': {
        title: '',
        left: <Button onClick={() => history.go(-1)}>返回</Button>,
        right: false
      },
      '/event-edit': {
        title: '',
        left: <Button onClick={() => history.go(-1)}>返回</Button>,
        right: <Button onClick={() => {
          Modal.confirm({
            content: '是否确定删除',
            onConfirm: async () => {
              try {
                await deleteTime({
                  _id: state._id
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
        }}>删除</Button>,
      },
      '/image-list': {
        title: '',
        left: <Button onClick={() => history.go(-1)}>返回</Button>,
        right: (
          <Button
            onClick={() =>
              history.push('/image-delete', {
                event: state._id,
              })
            }
          >
            管理
          </Button>
        )
      },
      '/image-edit': {
        title: '',
        left: <Button onClick={() => history.go(-1)}>返回</Button>,
      },
      '/image-delete': {
        title: '',
        left: <Button onClick={() => history.go(-1)}>返回</Button>,
        right: ''
      },
      '/image-detail': {
        title: '',
        left: <Button onClick={() => history.go(-1)}>返回</Button>,
        right: (
          <Button onClick={() => history.push('/image-edit', state)}>编辑</Button>
        )
      }
    }
  }, [state])

  const {
    title,
    left,
    right
  } = useMemo(() => {
    return (PATH_HEADER_MAP as any)[currentPath] || PATH_HEADER_MAP['/']
  }, [currentPath, PATH_HEADER_MAP])

  const handleBack = useCallback(() => {
    history.replace('/');
  }, []);

  useEffect(() => {
    function listener() {
      const currentKey = history.location.pathname
      setCurrentPath(currentKey)
    }
    Emitter.addListener('route-change', listener)
    listener()
    return () => {
      Emitter.removeListener('route-listener')
    }
  }, []);

  return (
    <div className={styles['header']}>
      <div className={styles['header-left']}>
        {left}
      </div>
      <div className={styles['header-center']}>
        {
          title || '倒数日'
        }
      </div>
      <div className={styles['header-right']}>
        {right}
      </div>
    </div>
  );
};

export default Header;
