import { request } from '@umijs/max';
import { BaseQueryImpl, PageQuery, PageResult } from '@/types';
import { SampleDetail, SamplePage, SampleQuery } from '@/types/sample';
import dayjs from 'dayjs';

export function createJob() {}


export function getTissueList() {
}


// 下载样本数据
export async function downloadSample(samplePage: SamplePage) {
  const id = samplePage.id;
  const sample_id = samplePage.sample_id
  const response = await request<Blob>(`/v1/sample/download?id=${id}`, {
    method: 'GET',
    responseType: 'blob',
  });
  downloadBlob(response, `${sample_id}.h5ad`);
}
/**
 * 分页查询Sample
 *
 * @param pageQuery 分页参数
 * @param sampleQuery 查询条件
 * @returns 含Sample详情列表的分页结果
 */
export async function fetchSampleByPage(
  pageQuery?: PageQuery,
  sampleQuery?: Partial<SampleQuery>,
) {
  let pageQueryParams: PageQuery;
  if (pageQuery === null || pageQuery === undefined) {
    pageQueryParams = BaseQueryImpl.create(1, 200);
  } else {
    pageQueryParams = pageQuery;
  }
  const params = {
    ...pageQueryParams,
    ...sampleQuery,
  };
  return request<PageResult<SamplePage>>('/v1/sample/page', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/**
 * 获取Sample详情
 *
 * @param id Sample的ID
 * @returns Sample详细信息
 */
export async function fetchSampleDetail(id: string) {
  return request<SampleDetail>(`/v1/sample/detail/${id}`, {
    method: 'GET',
  });
}
/**
 * 导出Sample数据
 *
 * @param ids 要导出的Sample的ID列表
 */
export async function exportSamplePage(ids: string[]) {
  await request(`/v1/sample/export`, {
    method: 'GET',
    params: {
      ids: ids, // UMI 会自动处理为重复参数
    },
    headers: {
      Accept: 'application/octet-stream',
    },
    skipErrorHandler: true,
    paramsSerializer: (params) => {
      // 自定义参数序列化（如果需要）
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
  }).then((resp) => {
    const timestamp = dayjs().format('YYYYMMDDHHmmss');
    downloadBlob(resp, `${timestamp}_dataset_data_export.xlsx`);
  });
}

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
/**
 * 批量移除Sample
 *
 * @param ids 要移除的Sample的ID数组
 */
export async function batchRemoveSample(ids: string[]) {
  const params = {
    ids: ids,
  };
  return request<void>('/sample/batch-remove', {
    method: 'DELETE',
    params: {
      ...params,
    },
  });
}
