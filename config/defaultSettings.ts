import { Settings as LayoutSettings } from '@ant-design/pro-layout';

type settingType = {
  pwa?: boolean;
  logo?: string;
  locale?: boolean;
};

const Settings: LayoutSettings & settingType = {
  title: 'ScEmbSearch',
  locale: true,
  colorPrimary: '#1890ff',
  layout: 'top',
  navTheme: 'light',
  contentWidth: 'Fixed',
  fixedHeader: true,
  pwa: false,
  logo: '/main-logo.png',
  footerRender: false,
  menuRender: false,
  iconfontUrl: '',
};

export default Settings;
