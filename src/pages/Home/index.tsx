import { GridContent } from '@ant-design/pro-components';
import { Card, Space, Button } from 'antd';
import React, { useEffect } from 'react';
import { liveness } from '@/service/probe';
import { useIntl } from '@umijs/max';
import { DatabaseOutlined, QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';

// 路由配置
const routes = [
  {
    path: '/dataset',
    key: 'dataset',
    name: 'dataset',
    icon: 'database',
    component: '@/pages/Dataset/index',
  },
  {
    path: '/search',
    key: 'search',
    name: 'search',
    icon: 'search',
    component: '@/pages/Search/index',
  },
  {
    path: '/help',
    key: 'help',
    name: 'help',
    icon: 'QuestionCircle',
    component: '@/pages/Help/index',
  },
];

const HomePage: React.FC = () => {
  const intl = useIntl();
  const navigate = useNavigate();

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
          <div className="grid grid-cols-2 gap-x-2 py-14 px-16 ">
            <div>
              <div>
                <h1 className="text-2xl font-bold mb-2">ScEmbSearch</h1>
                <div>{intl.formatMessage({ id: 'pages.home.introduction' })}</div>
              </div>
              <div>
                <h2 className="text-lg mt-14">
                  {intl.formatMessage({ id: 'pages.home.shortcut' })}
                </h2>
                <Space direction="horizontal" size="large" className="mt-2">
                  <Space  onClick={() => navigate("/dataset")} className={"cursor-pointer border-none shadow-none hover:scale-105 w-24 h-24 bg-gradient-to-br from-[#6EE7B7] to-[#3B82F6] p-4 hover:text-gray-500 hover:shadow rounded-md transition-all duration-300"} >
                    {<DatabaseOutlined />}
                    <button
                        key={"dataset"}
                    >
                      {intl.formatMessage({ id: 'menu.dataset' })}
                    </button>
                  </Space>
                  <Space onClick={() => navigate("/search")} className={"cursor-pointer border-none shadow-none hover:scale-105 w-24 h-24 bg-gradient-to-br from-blue-300 to-purple-400 p-4 hover:text-gray-500 hover:shadow rounded-md transition-all duration-300"} >
                    {<SearchOutlined />}
                    <button
                        key={"search"}
                    >
                      {intl.formatMessage({ id: 'menu.search' })}
                    </button>
                  </Space>
                  <Space onClick={() => navigate("/help")} className={"cursor-pointer border-none shadow-none hover:scale-105 w-24 h-24 bg-gradient-to-br from-indigo-200 to-[#4673F4] p-4 hover:text-gray-500 hover:shadow rounded-md transition-all duration-300"} >
                    {<QuestionCircleOutlined />}
                    <button
                        key={"help"}
                    >
                      {intl.formatMessage({ id: 'menu.help' })}
                    </button>
                  </Space>
                </Space>
              </div>
            </div>
            <div>
              <img
                  className="mx-auto rounded-xl h-96 w-96 p-12 cursor-pointer hover:scale-105 transition-all duration-300"
                  src="/scembsearch.png"
                  alt="scembsearch"
              />
            </div>
          </div>
        </Card>
      </GridContent>
  );
};

export default HomePage;