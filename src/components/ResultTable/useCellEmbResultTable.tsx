import { useIntl } from '@umijs/max';
import type { ColumnsType } from 'antd/lib/table';
import { CellEmbResult } from '@/types/job';

export default function useCellEmbResultTable() {
  const intl = useIntl();

  const columns: ColumnsType<CellEmbResult> = [
    {
      title: intl.formatMessage({ id: 'component.result.rank' }),
      key: 'index',
      align: 'left',
      render: (text: string, record: CellEmbResult, idx: number) => <span className={"p-4"}>{idx + 1}</span>,
    },
    {
      title: intl.formatMessage({ id: 'component.result.study' }),
      dataIndex: 'study',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'component.result.sample' }),
      dataIndex: 'sample',
      ellipsis: true,
      render: (text: string, record: CellEmbResult) => {
        if (text) {
          const rawText = text;
          let processedText = text;
          if (text.includes('-')) {
            processedText = text.split('-')[1];
          }
          const encodedText = encodeURIComponent(processedText);
          return (
            <a
              href={`https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=${encodedText}`}
              target="_blank"
              className={'text-blue-500'}
            >
              {rawText}
            </a>
          );
        } else {
          return '-';
        }
      },
    },
    {
      title: intl.formatMessage({ id: 'component.result.prediction' }),
      dataIndex: 'prediction',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'component.result.tissue' }),
      dataIndex: 'tissue',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'component.result.cell_line' }),
      dataIndex: 'cell_line',
      render: (text: boolean, record: CellEmbResult) => {
        if (text) {
          return <span className={"p-6"}>{intl.formatMessage({ id: 'component.result.yes' })}</span>;
        } else {
          return <span className={"p-6"}>{intl.formatMessage({ id: 'component.result.no' })}</span>;
        }
      },
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'component.result.disease' }),
      dataIndex: 'disease',
      ellipsis: true,
    },
  ];

  return [columns] as const;
}