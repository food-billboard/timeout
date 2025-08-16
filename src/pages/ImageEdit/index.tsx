import { Form, Toast, Button, DatePicker, TextArea } from 'antd-mobile';
import { history } from 'umi';
import { useCallback, RefObject } from 'react';
import classnames from 'classnames';
import dayjs from 'dayjs';
import type { DatePickerRef } from 'antd-mobile/es/components/date-picker';
import { putImage } from '@/services/base';
import styles from './index.less';

const ImageEdit = () => {

  const imageData = (history.location.state || {}) as API_TIME.GetTimeImageListData

  const onSubmit = useCallback(async (values: any) => {
    const handler = Toast.show({
      content: '处理中',
      maskClickable: false,
      duration: 0,
    });

    return putImage({
      ...imageData,
      ...values,
    })
      .then(() => {
        handler.close();
        history.go(-1)
      });
  }, [imageData]);

  return (
    <div className={classnames(styles['image-edit'])}>
      <div className={styles['image-edit-main']}>
        <Form
          layout="horizontal"
          footer={
            <Button block type="submit" color="primary" size="large">
              提交
            </Button>
          }
          onFinish={onSubmit}
          initialValues={{
            ...imageData,
            create_date: dayjs(imageData.create_date).toDate(),
          }}
        >
          <Form.Item
            name="create_date"
            label="日期"
            trigger="onConfirm"
            onClick={(e, datePickerRef: RefObject<DatePickerRef>) => {
              datePickerRef.current?.open();
            }}
            initialValue={dayjs().toDate()}
          >
            <DatePicker>
              {(value) =>
                value ? dayjs(value).format('YYYY-MM-DD') : '请选择日期'
              }
            </DatePicker>
          </Form.Item>
          <Form.Item name="description" label="" layout="vertical">
            <TextArea
              placeholder="请输入描述"
              maxLength={100}
              rows={2}
              showCount
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ImageEdit;
