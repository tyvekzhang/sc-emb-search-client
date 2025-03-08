import { request } from '@umijs/max';

export async function queryJobResult(jobId: string) {
  return request<ResultTaskType.JobResType>('/api/v1/job/getRequest', {
    method: 'GET',
    params: { jobId },
  });
}
