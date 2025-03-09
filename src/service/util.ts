import { request } from '@@/exports';

export function extractFilename(disposition: string | undefined): string | null {
  if (!disposition) return null;

  const filenameMatch = disposition.split(/;(.+)/)[1]?.split(/=(.+)/)[1];
  if (!filenameMatch) return null;

  let filename = filenameMatch;
  if (filename.toLowerCase().startsWith("utf-8''")) {
    filename = decodeURIComponent(filename.replace("utf-8''", ''));
  } else {
    filename = filename.replace(/['"]/g, '');
  }
  return filename;
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