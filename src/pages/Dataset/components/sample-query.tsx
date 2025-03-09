import { Button, Form, Input, Select, Space } from 'antd';
import { useAppSelector } from '@/stores';
import { FormInstance } from 'antd/es/form';
import React from 'react';
import { useIntl } from '@umijs/max';

interface SampleQueryProps {
  onSampleQueryFinish: () => void;
  onSampleQueryReset: () => void;
  sampleQueryForm: FormInstance;
}

const SampleQueryComponent: React.FC<SampleQueryProps> = ({
  onSampleQueryFinish,
  onSampleQueryReset,
  sampleQueryForm,
}) => {
  const intl = useIntl();
  const species = intl.formatMessage({ id: 'pages.dataset.species' });
  const select = intl.formatMessage({ id: 'pages.search.select' });
  const input = intl.formatMessage({ id: 'pages.dataset.input' });
  const sampleName = intl.formatMessage({ id: 'pages.dataset.sampleName' });
  const projectName = intl.formatMessage({ id: 'pages.dataset.projectName' });
  const tissueOrgan = intl.formatMessage({ id: 'pages.dataset.tissueOrgan' });
  const cellCount = intl.formatMessage({ id: 'pages.dataset.cellCount' });
  const sequencingPlatform = intl.formatMessage({
    id: 'pages.dataset.sequencingPlatform',
  });
  const operation = intl.formatMessage({ id: 'pages.dataset.operation' });
  const total = intl.formatMessage({ id: 'pages.dataset.total' });
  const items = intl.formatMessage({ id: 'pages.dataset.items' });
  const details = intl.formatMessage({ id: 'pages.dataset.details' });
  const download = intl.formatMessage({ id: 'pages.dataset.download' });
  const exportText = intl.formatMessage({ id: 'pages.dataset.export' });
  const search = intl.formatMessage({ id: 'pages.dataset.search' });
  const reset = intl.formatMessage({ id: 'pages.dataset.reset' });
  const settingColumn = intl.formatMessage({
    id: 'pages.dataset.settingColumn',
  });
  const sampleDetailTitle = intl.formatMessage({
    id: 'pages.dataset.sampleDetail',
  });
  const handleSampleQueryReset = () => {
    onSampleQueryReset();
    onSampleQueryFinish();
  };
  const { dictData } = useAppSelector((state) => state.dict);

  return (
    <Form
      form={sampleQueryForm}
      name="sampleQuery"
      onFinish={onSampleQueryFinish}
      layout="horizontal"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-0 gap-x-2 pt-4 px-2 border-b"
    >
      <Form.Item name="species" label={species} wrapperCol={{ span: 16 }}>
        <Select
          placeholder={select}
          allowClear
          options={[
            { value: '1', label: 'Homo sapiens' },
            { value: '2', label: 'Mouse' },
          ]}
        ></Select>
      </Form.Item>
      <Form.Item name="tissue" label={tissueOrgan} wrapperCol={{ span: 16 }}>
        <Input placeholder={input} allowClear />
      </Form.Item>
      <Form.Item name="sample_id" label={sampleName} wrapperCol={{ span: 16 }}>
        <Input placeholder={input} allowClear />
      </Form.Item>
      <Form.Item className="flex justify-end">
        <Space className="inline-flex">
          <Button onClick={handleSampleQueryReset}>{reset}</Button>
          <Button type="primary" htmlType="submit">
            {search}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SampleQueryComponent;
