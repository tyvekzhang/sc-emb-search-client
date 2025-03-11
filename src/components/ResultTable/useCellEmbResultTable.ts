import { useIntl } from '@umijs/max';
import type { ColumnsType } from 'antd/lib/table';
import { CellEmbResult } from '@/types/job';

export default function useCellEmbResultTable() {
  const intl = useIntl();

  const columns: ColumnsType<CellEmbResult> = [
    {
      title: intl.formatMessage({ id: 'component.result.rank' }),
      key: 'index',
      width: "5%",
      fixed: 'left',
      render: (text: string, record: CellEmbResult, idx: number) => idx + 1,
    },
    {
      title: intl.formatMessage({ id: 'component.result.study' }),
      dataIndex: 'study',
      width: "12%",
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'component.result.sample' }),
      dataIndex: 'sample',
      width: "15%",
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'component.result.prediction' }),
      dataIndex: 'prediction',
      width: "15%",
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'component.result.tissue' }),
      dataIndex: 'tissue',
      width: "8%",
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'component.result.cell_line' }),
      dataIndex: 'cell_line',
      width: "8%",
      render: (text: boolean, record: CellEmbResult) => {
        if (text) {
          return intl.formatMessage({ id: 'component.result.yes' })
        } else {
          return intl.formatMessage({ id: 'component.result.no' })
        }
      },
    },
    {
      title: intl.formatMessage({ id: 'component.result.disease' }),
      dataIndex: 'disease',
      width: "8%",
      ellipsis: true,
    },
  ];

  return [columns] as const;
}