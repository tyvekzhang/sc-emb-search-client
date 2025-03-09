import { prefix } from '@/config';
import { useIntl } from '@umijs/max';
import { Modal, Table } from 'antd';
import React, { memo } from 'react';
import styles from './index.less';
import useCellEmbResultTable from './useCellEmbResultTable';

export type resultDataType = {
  title?: string;
  jobId?: string;
  tableData: ResultTaskType.JobType[];
};

type resultPropsType = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
} & resultDataType;

const ResultTable: React.FC<resultPropsType> = (props) => {
  const { tableData, jobId, visible, setVisible, title } = props;
  const intl = useIntl();
  const [columns] = useCellEmbResultTable();
  let _tableData = tableData;
  const titleTxt = jobId
    ? title
      ? title + `(JobId: ${jobId})`
      : 'JobId: ' + jobId
    : title;

  return (
    <Modal
      width="1200px"
      title={
        tableData && tableData.length ? (
          <div className={styles.header}>
            <div className="my-3">{titleTxt}</div>
            <a className="text-blue-500 font-medium" href={`${prefix}/api/job/exportResult?jobId=${jobId}`} download>
              {intl.formatMessage({ id: 'component.result.download' })}
            </a>
          </div>
        ) : (
          titleTxt
        )
      }
      open={visible}
      onCancel={() => setVisible(false)}
      footer={null}
    >
      <Table
        size="small"
        className="cus-table"
        columns={columns}
        rowKey="id"
        dataSource={_tableData}
        pagination={false}
        scroll={{ x: true, y: 'calc(100vh - 280px)' }}
      />
    </Modal>
  );
};

export default memo(ResultTable);
