import ColumnVisibilityControl from '@/components/base/column-visibility-control';
import { SettingOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Popover, Space, Tooltip } from 'antd';
import React from 'react';
import { useIntl } from '@umijs/max';

interface ActionButtonsConfig {
  showCreate?: boolean;
  showImport?: boolean;
  showExport?: boolean;
  showModify?: boolean;
  showRemove?: boolean;
}

interface ActionButtonsProps {
  onCreate: () => void;
  onImport: () => void;
  onExport: () => void;
  onBatchModify: () => void;
  onConfirmBatchRemove: () => void;
  onConfirmBatchRemoveCancel: () => void;
  isQueryShow: boolean;
  onQueryShow: () => void;
  isExportDisabled: boolean;
  isBatchModifyDisabled: boolean;
  isBatchRemoveDisabled: boolean;
  isBatchRemoveLoading: boolean;
  isExportLoading: boolean;
  rawColumns: { key: number; title: string }[];
  visibleColumns: string[];
  onToggleColumnVisibility: (columnKey: number) => void;
  className?: string;
  actionConfig?: ActionButtonsConfig;
}

const ActionButtonComponent: React.FC<ActionButtonsProps> = ({
  onCreate,
  onImport,
  onExport,
  onBatchModify,
  onConfirmBatchRemove,
  onConfirmBatchRemoveCancel,
  isQueryShow,
  onQueryShow,
  isExportDisabled,
  isBatchModifyDisabled,
  isBatchRemoveDisabled,
  isBatchRemoveLoading,
  isExportLoading,
  rawColumns,
  visibleColumns,
  onToggleColumnVisibility,
  className = '',
  actionConfig = {},
}) => {
  const defaultConfig = {
    showCreate: true,
    showImport: false,
    showExport: false,
    showModify: false,
    showRemove: true,
  };
  const intl = useIntl();
  const species = intl.formatMessage({ id: 'pages.dataset.species'});
  const no = intl.formatMessage({ id: 'pages.dataset.no'});
  const sampleName = intl.formatMessage({ id: 'pages.dataset.sampleName'});
  const projectName = intl.formatMessage({ id: 'pages.dataset.projectName'});
  const projectTitle = intl.formatMessage({ id: 'pages.dataset.projectTitle'});
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

  const config = { ...defaultConfig, ...actionConfig };
  return (
    <div className="flex justify-between mb-1">
      <Space className={className}>
        {config.showCreate && (
          <Button onClick={onCreate} className="btn-add">
            新增
          </Button>
        )}
        {config.showImport && (
          <Button onClick={onImport} className="btn-import">
            导入
          </Button>
        )}
        {config.showExport && (
          <Button loading={isExportLoading} disabled={isExportDisabled} onClick={onExport} className="btn-export">
            {exportText}
          </Button>
        )}
        {config.showModify && (
          <Button disabled={isBatchModifyDisabled} onClick={onBatchModify} className="btn-batch-update">
            编辑
          </Button>
        )}
        {config.showRemove && (
          <Popconfirm
            title="删除所选的内容"
            description="你确定删除吗? 删除后将无法找回"
            onConfirm={onConfirmBatchRemove}
            onCancel={onConfirmBatchRemoveCancel}
            okText="是"
            cancelText="否"
          >
            <Button loading={isBatchRemoveLoading} disabled={isBatchRemoveDisabled} className="btn-batch-delete">
              删除
            </Button>
          </Popconfirm>
        )}
      </Space>
      <Space className="pr-2">
        <Popover
          content={
            <ColumnVisibilityControl
              columns={rawColumns}
              visibleColumns={visibleColumns}
              onToggleColumnVisibility={onToggleColumnVisibility}
            />
          }
          trigger="click"
          placement="bottomRight"
        >
          <Tooltip title={settingColumn}>
            <Button className="border-none" icon={<SettingOutlined />} />
          </Tooltip>
        </Popover>
      </Space>
    </div>
  );
};

export default ActionButtonComponent;
