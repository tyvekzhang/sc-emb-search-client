import { request } from '@umijs/max';
import { BaseQueryImpl, PageQuery, PageResult } from '@/types';
import {
  JobQuery,
  JobCreate,
  JobModify,
  JobDetail,
  JobPage,
  JobBatchModify, JobSubmit,
} from '@/types/job';
import { downloadBlob } from '@/service/util';

export async function submitJob(jobSubmit: JobSubmit) {
  return request<number>('/v1/job/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: jobSubmit,
  });
}