import { request } from '@umijs/max';

export async function uploadFile(fileData: any) {
  return request<string>('/v1/file/upload', {
    method: 'POST',
    data: fileData,
    requestType: 'form',
  });
}
