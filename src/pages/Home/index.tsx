import { GridContent } from '@ant-design/pro-components';
import { Card } from 'antd';
import React, { useEffect } from 'react';
import { liveness } from '@/service/probe';

const HomePage: React.FC = () => {
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
        HomePage
      </Card>
    </GridContent>
  );
};

export default HomePage;
