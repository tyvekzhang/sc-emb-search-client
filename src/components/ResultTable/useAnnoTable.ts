import { useIntl } from '@umijs/max';
import type { ColumnsType } from 'antd/lib/table';

export default function useAnnoTable() {
  const intl = useIntl();

  const columns: ColumnsType<ResultTaskType.JobType> = [
    {
      title: intl.formatMessage({ id: 'component.result.rank' }),
      key: 'id',
      width: 50,
      fixed: 'left',
      render: (text: string, record: ResultTaskType.JobType, idx: number) =>
        idx + 1,
    },
    {
      title: intl.formatMessage({ id: 'component.result.name' }),
      dataIndex: 'name',
      width: 134,
    },
    {
      title: intl.formatMessage({ id: 'component.result.cellcount' }),
      dataIndex: 'cellcount',
      width: 134,
    },
    {
      title: intl.formatMessage({ id: 'component.result.percent' }),
      dataIndex: 'percent',
      width: 134,
    },
  ];
  return [columns] as const;
}
