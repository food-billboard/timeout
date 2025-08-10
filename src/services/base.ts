import request from '@/utils/request'

// 获取当前用户信息
export async function getUserInfo() {
  return request<any>('/api/user/customer', {
    method: 'GET',
    params: {
      _id: process.env.DEFAULT_CHILD_ID
    }
  });
}

// 事件列表
export const getTimeList = (params: API_TIME.GetTime) => {
  return request<API_TIME.GetListResponse<API_TIME.GetTimeListData>>('/api/customer/timeout', {
    method: 'GET',
    params
  });
};

// 新增事件
export const postTime = (data: API_TIME.PostTimeParams) => {
  return request('/api/customer/timeout', {
    method: 'POST',
    data
  });
};

// 修改事件
export const putTime = (data: API_TIME.PutTimeParams) => {
  return request('/api/customer/timeout', {
    method: 'PUT',
    data
  });
};

// 删除事件
export const deleteTime = (params: API_TIME.DeleteTimeParams) => {
  return request('/api/customer/timeout', {
    method: 'DELETE',
    params
  });
};

// 图片列表
export const getImageList = (params: API_TIME.GetTimeImage) => {
  return request<API_TIME.GetListResponse<API_TIME.GetTimeImageListData>>('/api/customer/timeout/image', {
    method: 'GET',
    params
  });
};

// 新增图片
export const postImage = (data: API_TIME.PostTimeImageParams) => {
  return request('/api/customer/timeout/image', {
    method: 'POST',
    data
  });
};

// 修改图片
export const putImage = (data: API_TIME.PutTimeImageParams) => {
  return request('/api/customer/timeout/image', {
    method: 'PUT',
    data
  });
};

// 删除图片
export const deleteImage = (params: API_TIME.DeleteTimeImageParams) => {
  return request('/api/customer/timeout/image', {
    method: 'DELETE',
    params
  });
};
