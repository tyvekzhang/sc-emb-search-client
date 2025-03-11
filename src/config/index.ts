// 定义环境类型
type EnvType = 'prod' | 'test' | 'dev';

// URL 映射
const urlMaps: Record<EnvType, string> = {
  prod: 'http://127.0.0.1', // 线上
  test: 'http://127.0.0.1:8501/api', // 测试环境
  // dev: 'http://127.0.0.1:19007/api', // 本地
  dev: 'http://10.101.4.78:19007/api', // 本地
};

// 从环境变量中获取当前环境
const { REACT_APP_ENV } = process.env;

// 获取前缀，默认为 'dev'
export const prefix = urlMaps[REACT_APP_ENV as EnvType] || urlMaps.dev;
