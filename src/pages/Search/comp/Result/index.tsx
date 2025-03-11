import ResultTable, { resultDataType } from '@/components/ResultTable';
import { queryJobResult } from '@/service/result';
import { clone, delIndexTask, getJobTask, TASK_KEY, taskType } from '@/utils';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import { useIntl } from '@umijs/max';
import { Card, message, Modal, Popconfirm, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { fetchJobDetail } from '@/service/job';

enum statusType {
  waiting = 1,
  executing = 2,
  completed = 3,
  error = 4,
}

const Result: React.FC<{ aKey: string }> = (props) => {
  const intl = useIntl();
  const [tasks, setTasks] = useState<taskType[]>([]);
  const [resultData, setResultData] = useState<resultDataType>({
    tableData: [],
  });
  const [visible, setVisible] = useState(false);

  // 初始化任务列表
  useEffect(() => {
    if (props.aKey === '2') {
      const _tasks = getJobTask();
      if (_tasks) {
        setTasks(_tasks);
      }
    }
  }, [props.aKey]);

  // 每 3 秒查询一次任务列表
  useEffect(() => {
    if (props.aKey === '2') {
      const interval = setInterval(async () => {
        const _tasks = getJobTask();
        if (_tasks) {
          // 筛选状态不为 3 的任务
          const filteredTasks = _tasks.filter((task) => task.status < statusType.completed);

          // 遍历筛选出的任务，调用 getDetail 接口
          for (const task of filteredTasks) {
            const detail = await fetchJobDetail(String(task.jobId));
            if (detail && detail.status !== task.status) {
              // 更新任务状态
              task.status = detail.status;
            }
          }

          // 更新本地存储和状态
          localStorage.setItem(TASK_KEY, JSON.stringify(_tasks));
          setTasks([..._tasks]);
        }
      }, 5000);

      // 清除定时器
      return () => clearInterval(interval);
    }
  }, [props.aKey]);

  // 删除任务
  const handleDelete = (idx: number) => {
    const _tasks = clone(tasks);
    _tasks.splice(idx, 1);
    setTasks(_tasks);
    delIndexTask(idx);
  };

  // 查询任务结果
  async function handleQueryResult(e: any, record: taskType) {
    e.preventDefault();
    const { jobId } = record;

    const hide = message.loading('Loading...', 2);
    const res = await queryJobResult(String(jobId)).catch(console.error);
    if (res) {
      if (statusType.waiting === res.status) {
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
      } else if (statusType.executing === res.status) {
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
      } else if (statusType.completed === res.status) {
        // 计算完成，但还需判断是否有结果
        if (res.records === undefined || res.records.length === 0) {
          message.error('Run result error');
        } else {
          setResultData({
            jobId: String(jobId),
            tableData: res.records || [],
          });
          setVisible(true);
        }
      } else {
        // 失败
        message.error('Job running failure');
      }
    }
    hide();
  }

  // 表格列定义
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
      title: intl.formatMessage({ id: 'pages.result.status' }),
      dataIndex: 'status',
      render: (text, record) => {
        if (text === 1) {
          return <Tag className={"p-1"} bordered={false} color="yellow">{intl.formatMessage({ id: 'pages.result.waiting' })}</Tag>;
        } else if (text === 2) {
          return <Tag className={"p-1"} bordered={false} color="processing">{intl.formatMessage({ id: 'pages.result.executing' })}</Tag>;
        } else if (text === 3) {
          return <Tag className={"p-1"} bordered={false} color="success">{intl.formatMessage({ id: 'pages.result.completed' })}</Tag>;
        } else {
          return <Tag className={"p-1"} bordered={false} color="error">{intl.formatMessage({ id: 'pages.result.error' })}</Tag>;
        }
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.result.operate' }),
      render: (_, record, idx) => (
          <Space >
            <button
                className="btn-operation"
                onClick={(e) => handleQueryResult(e, record)}
                disabled={record.status!== statusType.completed} // 禁用状态控制
            >
              <EyeOutlined className="w-3 h-3" />
              <span className="ml-1">
              {intl.formatMessage({ id: 'pages.result.btn' })}
            </span>
            </button>
            <Popconfirm
                title={intl.formatMessage({ id: 'pages.result.del.tip' })}
                onConfirm={() => handleDelete(idx)}
            >
              <button className="block btn-remove">
                <DeleteOutlined className="w-3 h-3" />
                <span className="ml-1">
                {intl.formatMessage({ id: 'pages.result.del' })}
              </span>
              </button>
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
              scroll={{ y: 'calc(100vh - 296px)' }}
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