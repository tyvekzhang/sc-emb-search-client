import ActionButtonComponent from '@/components/base/action-button';
import { PaginatedTable } from '@/components/base/paginated-table';
import TransitionWrapper from '@/components/base/transition-wrapper';
import { message } from 'antd';
import {
  downloadSample,
  exportSamplePage,
  fetchSampleByPage,
  fetchSampleDetail,
} from '@/service/sample';
import { useAppSelector } from '@/stores';
import { BaseQueryImpl } from '@/types';
import { SampleDetail, SamplePage, SampleQuery } from '@/types/sample';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import SampleDetailComponent from './components/sample-detail';
import SampleQueryComponent from './components/sample-query';
import { useIntl } from '@umijs/max';

const Sample: React.FC = () => {
  const intl = useIntl();
  const species = intl.formatMessage({ id: 'pages.dataset.species' });
  const no = intl.formatMessage({ id: 'pages.dataset.no' });
  const sampleName = intl.formatMessage({ id: 'pages.dataset.sampleName' });
  const downloading = intl.formatMessage({ id: 'pages.dataset.downloading' });
  const projectName = intl.formatMessage({ id: 'pages.dataset.projectName' });
  const tissueOrgan = intl.formatMessage({ id: 'pages.dataset.tissueOrgan' });
  const cellCount = intl.formatMessage({ id: 'pages.dataset.cellCount' });
  const sequencingPlatform = intl.formatMessage({
    id: 'pages.dataset.sequencingPlatform',
  });
  const operation = intl.formatMessage({ id: 'pages.dataset.operation' });
  const details = intl.formatMessage({ id: 'pages.dataset.details' });
  const download = intl.formatMessage({ id: 'pages.dataset.download' });

  // 配置模块
  const actionConfig = {
    showCreate: false,
    showImport: false,
    showExport: true,
    showModify: false,
    showRemove: false,
  };

  // 查询模块
  const { dictData } = useAppSelector(
    (state: Record<string, any>) => state.dict,
  );
  const [isSampleQueryShow, setIsSampleQueryShow] = useState<boolean>(true);
  const [samplePageDataSource, setSamplePageDataSource] = useState<
    SamplePage[]
  >([]);
  const [samplePageTotalCount, setSamplePageTotalCount] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const onSampleQueryShow = () => {
    setIsSampleQueryShow((prevState) => !prevState);
  };
  useEffect(() => {
    const fetchData = async () => {
      const sampleQuery =
        (await sampleQueryForm.validateFields()) as SampleQuery;
      const pageData = BaseQueryImpl.create(current, pageSize);
      const resp = await fetchSampleByPage(pageData, sampleQuery);
      setSamplePageDataSource(resp.records);
      setSamplePageTotalCount(resp.total);
      console.log(samplePageDataSource);
      console.log(samplePageTotalCount);
    };
    fetchData().then(() => {});
  }, [current, pageSize]);

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setCurrent(newPage);
    setPageSize(newPageSize);
  };
  const resetPagination = () => {
    setCurrent(1);
    setPageSize(10);
  };

  // 详情模块
  const [isSampleDetailDrawerVisible, setIsSampleDetailDrawerVisible] =
    useState<boolean>(false);
  const [sampleDetail, setSampleDetail] = useState<SampleDetail | null>(null);
  const onSampleDetail = async (samplePage: SamplePage) => {
    setIsSampleDetailDrawerVisible(true);
    const id = samplePage.id;
    await fetchSampleDetail(id).then(setSampleDetail);
  };

  const onSampleDetailClose = async () => {
    setSampleDetail(null);
    setIsSampleDetailDrawerVisible(false);
  };

  const handleSampleDownload = async (record: SamplePage) => {
    message.info(downloading)
    await downloadSample(record);
  };

  // 表格列信息
  const samplePageColumns: ColumnsType<SamplePage> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      hidden: true,
    },
    {
      title: no,
      dataIndex: 'No',
      key: 'No',
      render: (_: number, _record: SamplePage, rowIndex: number) =>
        rowIndex + 1,
      width: '8%',
    },
    {
      title: species,
      dataIndex: 'species',
      key: 'species',
      render: (text) => {
        if (text) {
          if (text === '1') {
            return "Homo sapiens";
          } else if (text === '2') {
            return "Mouse"
          } else {
            return "-"
          }
        } else {
          return "-"
        }
      },
      width: '12%',
      ellipsis: true,
    },
    {
      title: tissueOrgan,
      dataIndex: 'tissue',
      key: 'tissue',
      render: (text) => (text ? text : '-'),
      width: '12%',
      ellipsis: true,
    },
    {
      title: sampleName,
      dataIndex: 'sample_id',
      key: 'sample_id',
      render: (text) => (text ? text : '-'),
      width: '12%',
      ellipsis: true,
    },
    {
      title: projectName,
      dataIndex: 'project_id',
      key: 'project_id',
      render: (text) => (text ? text : '-'),
      width: '12%',
      ellipsis: true,
    },
    {
      title: sequencingPlatform,
      dataIndex: 'platform',
      key: 'platform',
      render: (text) => (text ? text : '-'),
      width: '12%',
      ellipsis: true,
    },
    {
      title: cellCount,
      dataIndex: 'cell_count',
      key: 'cell_count',
      width: '10%',
    },
    {
      title: operation,
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <div className="flex gap-2 items-center justify-center">
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-operation cursor-pointer"
            onClick={() => onSampleDetail(record)}
          >
            <EyeOutlined className="w-3 h-3" />
            {details}
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-operation cursor-pointer"
            onClick={() => handleSampleDownload(record)}
          >
            <DownloadOutlined className="w-3 h-3" />
            {download}
          </button>
        </div>
      ),
    },
  ];

  const [visibleColumns, setVisibleColumns] = useState(
    samplePageColumns.map((col) => col.key),
  );
  const onToggleColumnVisibility = (columnKey: number) => {
    setVisibleColumns((prevVisibleColumns) => {
      if (prevVisibleColumns.includes(columnKey)) {
        return prevVisibleColumns.filter((key) => key !== columnKey);
      } else {
        return [...prevVisibleColumns, columnKey];
      }
    });
  };
  const filteredSampleColumns = samplePageColumns.filter((col) =>
    visibleColumns.includes(col.key),
  );

  const [sampleQueryForm] = Form.useForm();
  const handleSampleQueryReset = () => {
    resetPagination();
    sampleQueryForm.resetFields();
  };
  const onSampleQueryFinish = async () => {
    const sampleQueryFormData = sampleQueryForm.getFieldsValue();
    sampleQueryFormData.create_time = sampleQueryFormData.create_time
      ? sampleQueryFormData.create_time.format('YYYY-MM-DD')
      : null;
    sampleQueryFormData.update_time = sampleQueryFormData.update_time
      ? sampleQueryFormData.update_time.format('YYYY-MM-DD')
      : null;
    const sampleQuery = sampleQueryFormData as SampleQuery;
    const filteredSampleQuery = Object.fromEntries(
      Object.entries(sampleQuery).filter(
        ([, value]) => value !== undefined && value !== null && value !== '',
      ),
    );
    resetPagination();
    await handleSampleQueryFinish(filteredSampleQuery as SampleQuery);
  };
  const handleSampleQueryFinish = async (sampleQuery: SampleQuery) => {
    await fetchSampleByPage(
      BaseQueryImpl.create(current, pageSize),
      sampleQuery,
    ).then((resp) => {
      setSamplePageDataSource(resp.records);
      setSamplePageTotalCount(resp.total);
    });
  };

  // 批量删除模块
  const [isBatchRemoveLoading, setIsBatchRemoveLoading] =
    useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<SamplePage[]>([]);
  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };
  const handleSelectionChange = (
    selectedRowKeys: React.Key[],
    selectedRows: SamplePage[],
  ) => {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  };
  const handleSampleBatchRemove = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的项目');
      return;
    }
    try {
      setIsBatchRemoveLoading(true);
      await onSampleQueryFinish();
      resetSelectedRows();
    } finally {
      setIsBatchRemoveLoading(false);
    }
  };
  const handleSampleBatchRemoveCancel = async () => {
    resetSelectedRows();
    message.info('操作已取消');
  };

  // 导出模块
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const onSampleExport = async () => {
    if (selectedRowKeys === null || selectedRowKeys.length === 0) {
      message.warning('请先选择导出的项目');
      return;
    }
    try {
      setIsExportLoading(true);
      await exportSamplePage(selectedRows.map((row) => row.id));
      resetSelectedRows();
    } finally {
      setIsExportLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 bg-white max-w-[1152px]">
      <TransitionWrapper show={isSampleQueryShow}>
        <div className="shadow-sm">
          <SampleQueryComponent
            onSampleQueryFinish={onSampleQueryFinish}
            onSampleQueryReset={handleSampleQueryReset}
            sampleQueryForm={sampleQueryForm}
          />
        </div>
      </TransitionWrapper>
      <div>
        <ActionButtonComponent
          onCreate={() => {}}
          onImport={() => {}}
          onExport={onSampleExport}
          onBatchModify={() => {}}
          onConfirmBatchRemove={handleSampleBatchRemove}
          onConfirmBatchRemoveCancel={handleSampleBatchRemoveCancel}
          isQueryShow={isSampleQueryShow}
          onQueryShow={onSampleQueryShow}
          isExportDisabled={selectedRowKeys.length === 0}
          isBatchModifyDisabled={selectedRowKeys.length === 0}
          isBatchRemoveDisabled={selectedRowKeys.length === 0}
          isBatchRemoveLoading={isBatchRemoveLoading}
          isExportLoading={isExportLoading}
          rawColumns={samplePageColumns as any[]}
          visibleColumns={visibleColumns as any[]}
          onToggleColumnVisibility={onToggleColumnVisibility}
          actionConfig={actionConfig}
          className="mb-2 mt-4"
        />
      </div>
      <div>
        <PaginatedTable<SamplePage>
          columns={filteredSampleColumns}
          dataSource={samplePageDataSource}
          total={samplePageTotalCount}
          current={current}
          pageSize={pageSize}
          onPaginationChange={handlePaginationChange}
          onSelectionChange={handleSelectionChange}
          selectedRowKeys={selectedRowKeys}
          rowKey="id"
        />
      </div>
      <div>
        <div>
          <SampleDetailComponent
            isSampleDetailDrawerVisible={isSampleDetailDrawerVisible}
            onSampleDetailClose={onSampleDetailClose}
            sampleDetail={sampleDetail}
          />
        </div>
      </div>
    </div>
  );
};

export default Sample;
