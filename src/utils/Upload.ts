import { Toast } from 'antd-mobile';
import { Upload } from 'chunk-file-upload';
import { nanoid } from 'nanoid';
import mime from 'mime'
import {
  checkUploadFile,
  uploadFile as requestUploadFile,
  DEFAULT_CHECK_UPLOAD_PARAMS,
  getUploadFile,
} from '@/services/upload';

const UPLOAD_INSTANCE = new Upload();

export function exitDataFn(onResponse: Function) {
  return async function (params: {
    filename: string;
    md5: string;
    suffix: string;
    size: number;
    chunkSize: number;
    chunksLength: number;
  }) {
    const { size, suffix, md5, chunkSize } = params;
    const data = await checkUploadFile({
      auth: 'PUBLIC',
      mime: suffix,
      chunk: chunkSize,
      md5,
      size,
      name: md5,
    });
    onResponse(data, `${process.env.API_DOMAIN}/static/${suffix.startsWith('image') ? 'image' : 'video'}/${md5}.${mime.getExtension(suffix)}`);
    return data;
  };
}

export function uploadFn() {
  return async function (data: any) {
    let response: any = {};
    const md5 = data.get('md5');
    const file = data.get('file');
    const index = data.get('index') as any;
    response = await requestUploadFile({
      md5: md5 as string,
      file: file as Blob,
      offset: (index as number) * DEFAULT_CHECK_UPLOAD_PARAMS.chunk,
    });
    return response;
  };
}

export const createBaseUploadFile: (file: File) => any = (file) => {
  return {
    size: file.size,
    name: file.name,
    fileName: file.name,
    lastModified: file.lastModified,
    status: 'uploading',
    percent: 0,
    // thumbUrl?: string;
    originFileObj: file,
  };
};

export const createUploadedFile = (url: string) => {
  const name = url.substring(url.lastIndexOf('\\') + 1);
  return {
    uid: nanoid(),
    name,
    fileName: name,
    status: 'done',
    url,
  };
};

// 导入 loading
let LEAD_IN_LOADING = false;
// 导出 loading
let EXPORT_LOADING = false;

// 文件上传
export async function upload(file: File) {
  const UPLOAD_INSTANCE = new Upload();

  let fileId: string = '';
  let filePath: string = ''

  return new Promise((resolve, reject) => {
    const [name] = UPLOAD_INSTANCE.add({
      file: {
        file,
      },
      request: {
        exitDataFn: exitDataFn(function (data: any, path: string) {
          fileId = data._id;
          filePath = path
        }),
        uploadFn: uploadFn(),
        callback(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: fileId,
              filePath
            });
          }
        },
      },
    });

    if (!name) {
      return Promise.reject();
    } else {
      UPLOAD_INSTANCE.deal(name);
    }
  })
    .then(() => {
      UPLOAD_INSTANCE.dispose();
      return {
        id: fileId,
        filePath
      };
    })
    .catch((err) => {
      UPLOAD_INSTANCE.dispose();
      return Promise.reject(err);
    });
}

export function uploadFile(config: {
  beforeUpload?: () => boolean;
  upload?: (file: File, index: number) => void;
  uploadEnd?: (fileId: string, index: number) => any;
  callback?: () => void;
  accept: string;
  multiple?: boolean 
}) {
  const { multiple, beforeUpload, upload: configUpload, uploadEnd, accept, callback } = config;
  if (beforeUpload && !beforeUpload()) return;
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', accept);
  if(multiple) {
    input.setAttribute('multiple', 'multiple')
  }
  input.addEventListener('change', async (e: any) => {
    const files = e.target?.files;
    for(let index = 0; index < (multiple ? files.length : 1); index ++) {
      const file = files[index]
      if (file) {
        configUpload?.(file, index);
        await upload(file)
          .then(({ id, filePath }: any) => {
            return uploadEnd?.(id, index);
          })
      }
    }
    callback?.()
  });
  input.click();
}
