import { useState, useRef, useCallback } from 'react';
import {
  InfiniteScroll,
  Space,
  Button,
  Grid,
  Checkbox,
  Modal,
  Toast,
} from 'antd-mobile';
import { history } from 'umi';
import classnames from 'classnames';
import { getImageList, deleteImage } from '@/services/base';
import styles from './index.less';
import { useGetState } from 'ahooks';
import { ImageGrid } from '../ImageList';

const ImageDelete = () => {
  const imageData = (history.location.state ||
    {}) as any;
  const { event } = imageData;

  const [dataSource, setDataSource, getDataSource] = useGetState<
    API_TIME.GetTimeImageListData[]
  >([]);
  const [hasMore, setHasMore] = useState(true);
  const [selectList, setSelectList] = useState<string[]>([]);

  const currentPage = useRef(-1);

  async function fetchData() {
    return getImageList({
      currPage: currentPage.current,
      pageSize: 999,
      event,
    }).then((data) => {
      const result =
        currentPage.current === 1
          ? data.list
          : [...getDataSource(), ...data.list];
      setDataSource(result);
      setHasMore(result.length < data.total);
    });
  }

  const handleCancel = useCallback(() => {
    setSelectList([]);
  }, []);

  const handleDelete = useCallback(() => {
    Modal.confirm({
      content: '是否确定删除',
      onConfirm: async () => {
        try {
          await deleteImage({
            _id: selectList.join(','),
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
  }, [selectList]);

  const handleSelect = useCallback(
    (value: API_TIME.GetTimeImageListData) => {
      const { _id } = value;
      const index = selectList.indexOf(_id);
      if (!!~index) {
        setSelectList((prev) => {
          const data = [...prev];
          data.splice(index, 1);
          return [...data];
        });
      } else {
        setSelectList([...selectList, _id]);
      }
    },
    [selectList],
  );

  const handleSelectAll = useCallback(() => {
    setSelectList((prev) => {
      return prev.length === dataSource.length
        ? []
        : dataSource.map((item) => item._id);
    });
  }, [dataSource]);

  return (
    <div className={classnames(styles['image-delete'])}>
      {(
        <>
          <div className={styles['image-delete-list']}>
            <Grid columns={3} gap={10}>
              {dataSource.map((item) => {
                return (
                  <Grid.Item key={item._id}>
                    <ImageGrid
                      value={item}
                      onClick={handleSelect}
                      extra={
                        <div className={styles['image-list-check']}>
                          <Checkbox checked={selectList.includes(item._id)} />
                        </div>
                      }
                    />
                  </Grid.Item>
                );
              })}
            </Grid>
          </div>
          <InfiniteScroll
            loadMore={async () => {
              currentPage.current++;
              return fetchData();
            }}
            hasMore={hasMore}
          />
        </>
      )}
      <div className={styles['image-delete-footer']}>
        <Button onClick={handleCancel}>取消</Button>
        <Button
          disabled={!selectList.length}
          color="danger"
          onClick={handleDelete}
        >
          删除
        </Button>
        <Button onClick={handleSelectAll}>
          <Space>
            <Checkbox checked={selectList.length === dataSource.length} />
            <span>全选</span>
          </Space>
        </Button>
      </div>
    </div>
  );
};

export default ImageDelete;
