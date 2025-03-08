import { useAppSelector } from '@/stores';
import { SampleDetail } from '@/types/sample';
import { Descriptions, Drawer } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { useIntl } from '@umijs/max';

interface SampleDetailDrawerProps {
  isSampleDetailDrawerVisible: boolean;
  onSampleDetailClose: () => void;
  sampleDetail: SampleDetail | null;
}

const SampleDetailComponent: React.FC<SampleDetailDrawerProps> = ({
  isSampleDetailDrawerVisible,
  onSampleDetailClose,
  sampleDetail,
}) => {
  const { dictData } = useAppSelector((state) => state.dict);
  const intl = useIntl();
  const species = intl.formatMessage({ id: 'pages.dataset.species'});
  const select = intl.formatMessage({ id: 'pages.search.select'});
  const sampleName = intl.formatMessage({ id: 'pages.dataset.sampleName'});
  const projectName = intl.formatMessage({ id: 'pages.dataset.projectName'});
  const tissueOrgan = intl.formatMessage({ id: 'pages.dataset.tissueOrgan'});
  const cellCount = intl.formatMessage({ id: 'pages.dataset.cellCount'});
  const sequencingPlatform = intl.formatMessage({ id: 'pages.dataset.sequencingPlatform'});
  const operation = intl.formatMessage({ id: 'pages.dataset.operation'});
  const total = intl.formatMessage({ id: 'pages.dataset.total'});
  const items = intl.formatMessage({ id: 'pages.dataset.items'});
  const details = intl.formatMessage({ id: 'pages.dataset.details'});
  const download = intl.formatMessage({ id: 'pages.dataset.download'});
  const exportText = intl.formatMessage({ id: 'pages.dataset.export'});
  const search = intl.formatMessage({ id: 'pages.dataset.search'});
  const reset = intl.formatMessage({ id: 'pages.dataset.reset'});
  const settingColumn = intl.formatMessage({ id: 'pages.dataset.settingColumn'});
  const sampleDetailTitle = intl.formatMessage({ id: 'pages.dataset.sampleDetail'});
  const projectTitle = intl.formatMessage({ id: 'pages.dataset.projectTitle'});
  const createTime = intl.formatMessage({ id: 'pages.dataset.createTime'});

  return (
    <Drawer
      title={sampleDetailTitle}
      open={isSampleDetailDrawerVisible}
      onClose={onSampleDetailClose}
      destroyOnClose
      width={'60%'}
    >
      {sampleDetail && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label={species}>
            {sampleDetail.species}
          </Descriptions.Item>
          <Descriptions.Item label={sampleName}>
            {sampleDetail.sample_id}
          </Descriptions.Item>
          <Descriptions.Item label={projectName}>
            {sampleDetail.project_id}
          </Descriptions.Item>
          <Descriptions.Item label={tissueOrgan}>
            {sampleDetail.tissue}
          </Descriptions.Item>
          <Descriptions.Item label={cellCount}>
            {sampleDetail.cell_count}
          </Descriptions.Item>
          <Descriptions.Item label={sequencingPlatform}>
            {sampleDetail.platform}
          </Descriptions.Item>
          <Descriptions.Item label={projectTitle}>
            {sampleDetail.project_title}
          </Descriptions.Item>
          <Descriptions.Item label={createTime}>
            {dayjs(sampleDetail.create_time).format('YYYY-MM-DD')}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
};

export default SampleDetailComponent;
