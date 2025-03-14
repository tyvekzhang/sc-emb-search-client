import { useIntl } from '@umijs/max';
import type { ColumnsType } from 'antd/lib/table';
import { CellEmbResult } from '@/types/job';

export default function useCellEmbResultTable() {
  const intl = useIntl();

  const columns: ColumnsType<CellEmbResult> = [
    {
      title: intl.formatMessage({ id: 'component.result.rank' }),
      key: 'index',
      width: '5%',
      fixed: 'left',
      render: (text: string, record: CellEmbResult, idx: number) => idx + 1,
    },
    {
      title: intl.formatMessage({ id: 'component.result.study' }),
      dataIndex: 'study',
      width: '12%',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'component.result.sample' }),
      dataIndex: 'sample',
      width: '15%',
      ellipsis: true,
      render: (text: string, record: CellEmbResult) => {
        if (text) {
          const rawText = text;
          let processedText = text;
          if (text.includes('-')) {
            processedText = text.split('-')[1];
          }
          // 对 processedText 进行编码
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
      width: '15%',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'component.result.tissue' }),
      dataIndex: 'tissue',
      width: '8%',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'component.result.cell_line' }),
      dataIndex: 'cell_line',
      width: '8%',
      render: (text: boolean, record: CellEmbResult) => {
        if (text) {
          return intl.formatMessage({ id: 'component.result.yes' });
        } else {
          return intl.formatMessage({ id: 'component.result.no' });
        }
      },
    },
    {
      title: intl.formatMessage({ id: 'component.result.disease' }),
      dataIndex: 'disease',
      width: '8%',
      ellipsis: true,
    },
  ];

  return [columns] as const;
}
