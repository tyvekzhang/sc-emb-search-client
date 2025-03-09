import { request } from '@umijs/max';
import { BaseQueryImpl, PageQuery, PageResult } from '@/types';
import {
  JobQuery,
  JobCreate,
  JobModify,
  JobDetail,
  JobPage,
  JobBatchModify,
} from '@/types/job';
import { downloadBlob } from '@/service/util';

/**
 * 分页查询Job
 *
 * @param pageQuery 分页参数
 * @param jobQuery 查询条件
 * @returns 含Job详情列表的分页结果
 */
export async function fetchJobByPage(pageQuery?: PageQuery, jobQuery?: Partial<JobQuery>) {
  let pageQueryParams: PageQuery;
  if (pageQuery === null || pageQuery === undefined) {
    pageQueryParams = BaseQueryImpl.create(1, 200);
  } else {
    pageQueryParams = pageQuery;
  }
  const params = {
    ...pageQueryParams,
    ...jobQuery
  };
  return request<PageResult<JobPage>>('/job/page', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/**
 * 获取Job详情
 *
 * @param id Job的ID
 * @returns Job详细信息
 */
export async function fetchJobDetail(id: string) {
  return request<JobDetail>(`/v1/job/detail/${ id }`, {
    method: 'GET',
  });
}

/**
 * 导出Job数据导入模板
 *
 */
export async function exportJobTemplate() {
  const response = await request<Blob>('/job/export-template', {
    method: 'GET',
    responseType: 'blob',
  });
  downloadBlob(response, '任务导入模板.xlsx');
}

/**
 * 导出Job数据
 *
 * @param ids 要导出的Job的ID列表
 */
export async function exportJobPage(ids: string[]) {
  const params = {
    ids: ids,
  };
  const response = await request<Blob>(`/job/export`, {
    method: 'GET',
    params: {
      ...params,
    },
    paramsSerializer: (params) => {
      const urlParams = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (Array.isArray(value)) {
          value.forEach((item) => urlParams.append(key, item));
        } else {
          urlParams.append(key, value);
        }
      });
      return urlParams.toString();
    },
    responseType: 'blob',
  });
  downloadBlob(response, '任务导出.xlsx');
}

/**
 * 创建Job
 *
 * @param jobCreate 创建数据
 * @returns 创建的Job的ID
 */
export async function createJob(jobCreate: JobCreate) {
  return request<number>('/job/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: jobCreate,
  });
}

/**
 * 导入Job数据并进行校验
 *
 * @param file 上传的Excel文件
 */
export async function importJob(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request<JobCreate[]>('/job/import', {
    method: 'POST',
    data: formData,
  });
}

/**
 * 批量创建Job
 *
 * @param jobCreateList 创建数据列表
 * @returns 创建的Job的ID列表
 */
export async function batchCreateJob(jobCreateList: JobCreate[]) {
  if (!jobCreateList?.length) {
    return Promise.resolve([]);
  }
  return request<number[]>('/job/batch-create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: jobCreateList,
  });
}

/**
 * 移除Job
 *
 * @param id 要移除的Job的Id
 */
export async function removeJob(id: string) {
  return request<void>(`/job/remove/${ id }`, {
    method: 'DELETE',
  });
}

/**
 * 批量移除Job
 *
 * @param ids 要移除的Job的ID数组
 */
export async function batchRemoveJob(ids: string[]) {
  const params = {
    ids: ids,
  };
  return request<void>('/job/batch-remove', {
    method: 'DELETE',
    params: {
      ...params,
    },
  });
}

/**
 * 更新Job信息
 *
 * @param jobModify 包含ID数组和修改的数据
 */
export async function modifyJob(jobModify: JobModify) {
  return request<void>('/job/modify', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: jobModify,
  });
}

/**
 * 批量更新Job信息
 *
 * @param jobBatchModify 包含ID数组和修改的数据
 */
export async function batchModifyJob(jobBatchModify: JobBatchModify) {
  return request<void>('/job/batch-modify', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: jobBatchModify,
  });
}