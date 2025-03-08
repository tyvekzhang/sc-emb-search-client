import { prefix } from '@/config';
import { useIntl } from '@umijs/max';
import { Modal, Table } from 'antd';
import { memo } from 'react';
import styles from './index.less';
import useAnnoTable from './useAnnoTable';

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
  const [columns] = useAnnoTable();
  let _tableData = tableData;
  const titleTxt = jobId
    ? title
      ? title + `(jobId: ${jobId})`
      : 'jobId: ' + jobId
    : title;

  return (
    <Modal
      width="1200px"
      title={
        tableData && tableData.length ? (
          <div className={styles.header}>
            <div>{titleTxt}</div>
            <a href={`${prefix}/api/job/exportResult?jobId=${jobId}`} download>
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
      <div style={{ textAlign: 'center' }}>
        <img src="./cell_type.png" alt="Cell type" style={{ height: '45vh' }} />
      </div>
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
