import { GridContent } from '@ant-design/pro-components';
import { Card, Space } from 'antd';
import React, { useEffect } from 'react';
import { liveness } from '@/service/probe';
import { useIntl } from '@umijs/max';
import { DatabaseOutlined, QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';

const HomePage: React.FC = () => {
  const intl = useIntl();
  useEffect(() => {
    const fetchLiveness = async () => {
      const livenessRes = await liveness();
      console.log('livenessRes', livenessRes);
    };

    fetchLiveness();
  }, []);
  return (
    <GridContent>
      <Card>
        <div className="grid grid-cols-2 gap-x-2 py-16 px-16 ">
          <div>
            <h1 className="text-2xl">ScEmbSearch</h1>
            <div>{intl.formatMessage({ id: 'pages.home.introduction' })}</div>
          </div>
          <div>
            <img
              className="mx-auto rounded-2xl shadow-3xl h-96 w-96"
              src="scembsearch.png"
              alt="scembsearch"
            />
          </div>
        </div>
      </Card>
    </GridContent>
  );
};

export default HomePage;
