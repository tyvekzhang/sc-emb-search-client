import { GridContent } from '@ant-design/pro-layout';
import { useIntl, useSearchParams } from '@umijs/max';
import { Card, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import Result from './comp/Result';
import Task from './comp/Job';

const { TabPane } = Tabs;

const Anno: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [aKey, setAKey] = useState('1');

  useEffect(() => {
    const queryKey = searchParams.get('p');
    if (queryKey) {
      setAKey(queryKey);
    }
  }, [searchParams]);

  const intl = useIntl();
  const task = intl.formatMessage({ id: 'pages.search.tab.task' });
  const result = intl.formatMessage({ id: 'pages.search.tab.result' });

  const onChange = (key: string) => {
    setSearchParams({ p: key });
  };

  return (
    <GridContent>
      <Card bordered={false}>
        <Tabs activeKey={aKey} onChange={onChange} type="card">
          <TabPane tab={task} key="1">
            {aKey === '1' && <Task setKey={onChange} />}
          </TabPane>
          <TabPane tab={result} key="2">
            {aKey === '2' && <Result aKey={aKey} />}
          </TabPane>
        </Tabs>
      </Card>
    </GridContent>
  );
};

export default Anno;
