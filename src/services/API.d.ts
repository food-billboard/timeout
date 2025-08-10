declare namespace Upload {
  export interface IDeleteParams {
    _id: string;
  }

  export interface ILooadParams {
    load: string;
  }

  export interface UploadParams {
    file: File;
  }

  export type TAuthType = 'PRIVATE' | 'PUBLIC';

  export interface ICheckUploadFileParams {
    'Tus-Resumable': '1.0.0';
    md5: string;
    auth: TAuthType;
    size: number;
    mime: string;
    name?: string;
    chunk: number;
  }

  export interface ICheckUploadFileRes {
    'Tus-Resumable': '1.0.0';
    location: string;
    'Upload-Offset': number;
    'Upload-Length': number;
    'Upload-Id': string;
  }

  export interface UploadRes {
    _id: string;
    url: string;
  }

  export interface IUploadParams {
    md5: string;
    offset: number;
    file: Blob;
  }

  export interface IGetUploadParams {
    _id: string;
    type?: 0 | 1 | 2;
  }
}

declare namespace API_TIME {

  export type GetListResponse<T> = {
    total: number 
    list: T[]
  }

  export type GetTime = {
    content?: string 
    start_date?: string 
    end_date?: string 
    currPage?: number 
    pageSize?: number
  }

  export type GetTimeListData = {
    _id: string 
    create_user: string 
    create_user_name: string 
    createdAt: string 
    updatedAt: string 
    event_name: string 
    start_date: string 
  }

  export type PutScoreMemoryParams = {
    _id: string 
    create_content: string 
    create_description?: string 
    target_score: number 
    score_type: string
  }

  export type GetScoreExchangeMemoryListParams = {
    content?: string 
    start_date?: string 
    end_date?: string 
    check_start_date?: string 
    check_end_date?: string 
    checked?: boolean 
    currPage?: number 
    pageSize?: number 
  }

  export type GetScoreExchangeMemoryListData = {
    _id: string 
    exchange_user: string 
    exchange_user_name: string 
    exchange_target: string 
    exchange_target_name: string 
    award_name: string 
    award_exchange_score: string 
    award_image_list: string[]
    check_time: string 
    createdAt: string 
    updatedAt: string 
    currPage: number 
    pageSize: number 
  }

  export type PostTimeParams = {
    event_name: string 
    start_date: string 
  }

  export type PutTimeParams = {
    _id: string 
  }

  export type DeleteTimeParams = {
    _id: string
  }

  export type GetTimeImage = {
    content?: string 
    start_date?: string 
    end_date?: string 
    currPage?: number 
    pageSize?: number
    event: string 
    _id?: string 
  }

  export type GetTimeImageListData = {
    _id: string 
    event: string 
    event_name: string 
    start_date: string 
    description: string 
    image: string 
    image_id: string 
    createdAt: string 
    updatedAt: string 
    create_date: string 
  }

  export type PostTimeImageParams = {
    description?: string 
    create_date: string 
    event: string 
    image: string
  }

  export type PutTimeImageParams = PostTimeImageParams & {
    _id: string 
  }

  export type DeleteTimeImageParams = {
    _id: string
  }


}
