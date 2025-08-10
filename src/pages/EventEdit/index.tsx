import dayjs from 'dayjs';
import { history } from 'umi';
import Header from '@/components/Header';
import type { DatePickerRef } from 'antd-mobile/es/components/date-picker';
import { postTime, putTime } from '@/services/base';
import { Toast, Form, Button, Input, DatePicker } from 'antd-mobile';
import classnames from 'classnames';
import styles from './index.less';
import { useCallback, RefObject } from 'react';

const EventEdit = () => {
  const editValue = (history.location.state || {}) as API_TIME.GetTimeListData;

  const onSubmit = useCallback(async (values: any) => {
    const handler = Toast.show({
      content: '处理中',
      maskClickable: false,
      duration: 0,
    });

    return (editValue._id ? putTime : postTime)(values).then(() => {
      handler.close();
      history.go(-1);
    });
  }, []);

  return (
    <div className={classnames(styles['event-edit'])}>
      <Header />
      <div className={styles['event-edit-main']}>
        <Form
          layout="horizontal"
          footer={
            <Button block type="submit" color="primary" size="large">
              保存
            </Button>
          }
          onFinish={onSubmit}
        >
          <Form.Item
            name="event_name"
            label="事件名称"
            rules={[{ required: true, message: '事件名称不能为空' }]}
          >
            <Input onChange={console.log} placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            name="start_date"
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
        </Form>
      </div>
    </div>
  );
};

export default EventEdit;
