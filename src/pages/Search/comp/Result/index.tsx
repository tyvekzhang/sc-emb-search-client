import ResultTable, { resultDataType } from '@/components/ResultTable';
import { queryJobResult } from '@/service/result';
import { clone, delIndexTask, getJobTask, taskType } from '@/utils';
import { GridContent } from '@ant-design/pro-layout';
import { useIntl } from '@umijs/max';
import { Card, message, Modal, Popconfirm, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';

enum statusType {
  waiting,
  executing,
  completed,
}

const Result: React.FC<{ aKey: string }> = (props) => {
  const intl = useIntl();
  const [tasks, setTasks] = useState<taskType[]>([]);
  useEffect(() => {
    if (props.aKey === '2') {
      const _tasks = getJobTask();
      if (_tasks) {
        setTasks(_tasks);
      }
    }
  }, [props.aKey]);

  const handleDelete = (idx: number) => {
    const _tasks = clone(tasks);
    _tasks.splice(idx, 1);
    setTasks(_tasks);
    delIndexTask(idx);
  };
  const [resultData, setResultData] = useState<resultDataType>({
    tableData: [],
  });
  const [visible, setVisible] = useState(false);
  async function handleQueryResult(e: any, record: taskType) {
    e.preventDefault();
    const { jobId } = record;

    const hide = message.loading('Loading...', 0);
    const _res = await queryJobResult(jobId).catch(console.error);
    if (_res) {
      const res = _res.data;
      if (statusType[0] === res.status) {
        Modal.warning({
          title: intl.formatMessage({ id: 'pages.form.job.wait' }),
          content: (
            <div>
              {intl.formatMessage(
                { id: 'pages.form.job.wait.tip' },
                { id: <b>{jobId}</b> },
              )}
            </div>
          ),
          maskClosable: true,
        });
      } else if (statusType[1] === res.status) {
        Modal.warning({
          title: intl.formatMessage({ id: 'pages.form.job.exec' }),
          content: (
            <div>
              {intl.formatMessage(
                { id: 'pages.form.job.exec.tip' },
                { id: <b>{jobId}</b> },
              )}
            </div>
          ),
          maskClosable: true,
        });
      } else if (statusType[2] === res.status) {
        // 计算完成，但还需判断是否有结果
        if (res.runStatus === 0) {
          setResultData({
            jobId: jobId,
            tableData: res.resultList || [],
          });
          setVisible(true);
        } else {
          message.error('Run result error');
        }
      } else {
        // 失败
        message.error('Job running failure');
      }
    }
    hide();
  }
  const columns: ColumnsType<taskType> = [
    {
      title: intl.formatMessage({ id: 'pages.result.jobId' }),
      dataIndex: 'jobId',
    },
    {
      title: intl.formatMessage({ id: 'pages.result.jobName' }),
      dataIndex: 'jobName',
    },
    {
      title: intl.formatMessage({ id: 'pages.result.time' }),
      dataIndex: 'gmtCreate',
    },
    {
      title: intl.formatMessage({ id: 'pages.result.operate' }),
      render: (_, record, idx) => (
        <Space size="large">
          <a href="#" onClick={(e) => handleQueryResult(e, record)}>
            {intl.formatMessage({ id: 'pages.result.btn' })}
          </a>
          <Popconfirm
            title={intl.formatMessage({ id: 'pages.result.del.tip' })}
            onConfirm={() => handleDelete(idx)}
          >
            <a href="#">{intl.formatMessage({ id: 'pages.result.del' })}</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <GridContent>
      <Card bordered={false}>
        <Table
          size="middle"
          columns={columns}
          scroll={{ y: 'calc(100vh - 296px' }}
          rowKey="jobId"
          dataSource={tasks}
          pagination={false}
        />
        <ResultTable
          visible={visible}
          setVisible={setVisible}
          {...resultData}
        />
      </Card>
    </GridContent>
  );
};

export default Result;
