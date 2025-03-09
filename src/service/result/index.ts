import { request } from '@umijs/max';

export async function queryJobResult(jobId: string) {
  return request<ResultTaskType.JobResType>('/v1/job/getResult', {
    method: 'GET',
    params: { job_id: jobId },
  });
}
