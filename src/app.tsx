import {Settings as LayoutSettings} from '@ant-design/pro-layout';
import type {
  AxiosResponse,
  RequestConfig,
  RunTimeLayoutConfig,
} from '@umijs/max';
import {message} from 'antd';
import {Provider} from "react-redux";

import {store} from '@/stores'

import defaultSettings from '../config/defaultSettings';
import RightComp from './components/RightComp';
import {prefix} from './config';

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightComp />,
    disableContentMargin: false,
    ...initialState?.settings,
  };
};

type InitStateType = {
  settings?: Partial<LayoutSettings>;
};
export async function getInitialState(): Promise<InitStateType> {
  return {
    settings: defaultSettings,
  };
}

export const rootContainer = (root: any) => {
  return (
      <Provider store={store} >
        {root}
      </Provider>
  )
}

// @ts-ignore
export const request: RequestConfig = {
  requestInterceptors: [
    (url, options) => ({ url: `${prefix}${url}`, options }),
  ],
  responseInterceptors: [
    // 统一处理错误
    (response: AxiosResponse<any>) => {
      // console.log('app-31-->', response);
      if (response.data && response.data.code > 0) {
        message.error(response.data.msg);
        throw new Error(response.data.msg);
      }
      // 检查 Content-Type 是否为文件流类型
      const contentType = response.headers['content-type'];
      const isFileStream = contentType && (
        contentType.includes('application/octet-stream') ||
        contentType.includes('application/pdf') ||
        contentType.includes('image/') ||
        // 可以根据需要添加更多文件流类型
        contentType.includes('application/zip') ||
        contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      );

      if (isFileStream) {
        return response;
      }

      return response.data;
    },
  ],
};
