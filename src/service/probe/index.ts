import { request } from '@umijs/max';

export async function liveness() {
  return request<void>('/v1/probe/liveness', {
    method: 'GET',
  });
}
