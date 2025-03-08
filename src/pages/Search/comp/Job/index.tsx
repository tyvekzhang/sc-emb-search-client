import { CloudOutlined, InboxOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import { useIntl } from '@umijs/max';
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Slider,
  Tabs,
  Upload,
} from 'antd';
import type { RcFile, UploadRequestOption } from 'rc-upload/lib/interface';
import type React from 'react';
import { useEffect, useState } from 'react';

// Services
import { uploadFile } from '@/service/file';
import { createJob, getTissueList } from '@/service/sample';

// Utils
import {
  filterOperate,
  type optionType,
  setJobTask,
  transformOptions,
} from '@/utils';

const { TabPane } = Tabs;

interface TaskProps {
  setKey: (key: string) => void;
}

const Task: React.FC<TaskProps> = ({ setKey }) => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const [tissue, setTissue] = useState<string>();
  const [options, setOptions] = useState<optionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [fileId, setFileId] = useState('')

  // Localized strings
  const texts = {
    inputData: intl.formatMessage({ id: 'pages.search.input.data' }),
    require: intl.formatMessage({ id: 'pages.form.require' }),
    referenceTissue: intl.formatMessage({
      id: 'pages.search.reference.tissue',
    }),
    selectReference: intl.formatMessage({ id: 'pages.search.select' }),
    uploadTip: intl.formatMessage({ id: 'pages.search.upload.tip' }),
    h5adTip: intl.formatMessage({ id: 'pages.search.h5ad.tip' }),
    cellCount: intl.formatMessage({ id: 'pages.search.label.cellCount' }),
    cellIndex: intl.formatMessage({ id: 'pages.search.label.cellIndex' }),
    cellIndexTip: intl.formatMessage({ id: 'pages.search.label.cellIndexTip' }),
    nickname: intl.formatMessage({ id: 'pages.search.label.nickname' }),
    nicknameTip: intl.formatMessage({ id: 'pages.search.label.nickname.tip' }),
    jobnameTip: intl.formatMessage({ id: 'pages.search.label.jobname.tip' }),
    submitBtn: intl.formatMessage({ id: 'pages.search.submitBtn' }),
    formSubmit: intl.formatMessage({ id: 'pages.form.submit' }),
    formSubmitOne: intl.formatMessage(
      { id: 'pages.form.submit.one' },
      { id: '' },
    ),
  };

  useEffect(() => {
    fetchTissueList();
    form.setFieldsValue({
      cellCount: 1000,
    });
  }, []);

  const fetchTissueList = async () => {
    try {
      const res = await getTissueList();
      const transformedOptions = transformOptions(res.data);
      setOptions(transformedOptions);
    } catch (error) {
      console.error('Failed to fetch tissue list:', error);
    }
  };

  const handleSelectReference = (value: any, option: any) => {
    setTissue(option.label);
  };

  const normalizeFileList = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleCustomUpload = (options: UploadRequestOption<any>) => {
    const { data, onSuccess, onError } = options;
    const file = options.file as RcFile;

    const formData = new FormData();

    if (data) {
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key] as string);
      });
    }

    formData.append('file', file);

    uploadFile(formData)
      .then((resp) => {
        if (resp) {
          setFileId(resp)
          onSuccess?.(file);
        } else {
          onError?.(new Error('Upload Error'));
        }
      })
      .catch((error) => {
        onError?.(error);
      });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values:', values)

      setLoading(true);

      // Handle different data based on active tab
      const data: any = {
        tissue,
      };

      if (activeTab === '1' && values.fileList) {
        data.inputUrl = values.fileList[0].response;
      } else if (activeTab === '2') {
        // Handle data for "Select from List" tab
        // Add the appropriate data field based on your requirements
      }

      if (values.jobName) {
        data.jobName = values.jobName;
      }

      if (values.cellCount) {
        data.cellCount = values.cellCount;
      }

      const res = await createJob(data);

      if (res) {
        const { jobId, gmtCreate, cellCount } = res.data;

        setJobTask({
          jobId,
          jobName: values.jobName || tissue,
          cellCount,
          gmtCreate,
        });

        form.resetFields();
        setKey('2');

        setTimeout(() => {
          Modal.warning({
            title: texts.formSubmit,
            content: (
              <div>
                {intl.formatMessage(
                  { id: 'pages.form.submit.one' },
                  { id: <b>{jobId}</b> },
                )}
              </div>
            ),
            maskClosable: true,
          });
        }, 400);
      }
    } catch (e: any) {
      if (e.errorFields?.length > 0) {
        const fieldName = e.errorFields[0].name[0];
        form.scrollToField(fieldName, {
          behavior: 'smooth',
          block: 'center',
        });
      }
      console.error('Form validation failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleSliderChange = (value: number) => {
    form.setFieldsValue({ cellCount: value });
  };

  return (
    <GridContent>
      <Card bordered={false}>
        <Form layout="vertical" form={form}>
          <Tabs
            defaultActiveKey="1"
            onChange={handleTabChange}
            className="w-2/3 -mt-4"
          >
            <TabPane
              tab={
                <span>
                  <InboxOutlined /> Local File
                </span>
              }
              key="1"
            >
              <Form.Item
                label={texts.inputData}
                name="fileList"
                valuePropName="fileList"
                getValueFromEvent={normalizeFileList}
                rules={[
                  { required: activeTab === '1', message: texts.require },
                ]}
              >
                <Upload.Dragger
                  name="file"
                  maxCount={1}
                  accept=".h5ad"
                  customRequest={handleCustomUpload as any}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">{texts.uploadTip}</p>
                  <p className="ant-upload-hint">{texts.h5adTip}</p>
                </Upload.Dragger>
              </Form.Item>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <CloudOutlined /> Remote File
                </span>
              }
              key="2"
            >
              <Form.Item
                label={texts.referenceTissue}
                name="tissue"
                rules={[{ required: true, message: texts.require }]}
              >
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder={texts.selectReference}
                  onChange={handleSelectReference}
                  options={options}
                  filterOption={filterOperate}
                />
              </Form.Item>
              <Form.Item
                label="Select from Available Files"
                name="selectedFile"
                rules={[
                  { required: activeTab === '2', message: texts.require },
                ]}
              >
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Select a file"
                  filterOption={filterOperate}
                />
              </Form.Item>
            </TabPane>
          </Tabs>
          {/* More common form items outside tabs */}
          <Form.Item
            wrapperCol={{ span: 16 }}
            label={texts.cellCount}
            name="cellCount"
            rules={[{ required: true, message: texts.require }]}
          >
            <Slider
              defaultValue={1000}
              max={10000}
              step={1000}
              onChange={handleSliderChange}
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{ span: 16 }}
            label={texts.cellIndex}
            name="cellIndex"
          >
            <Input placeholder={texts.cellIndexTip} />
          </Form.Item>
          <Divider />
          <Form.Item
            label={texts.nickname}
            extra={texts.nicknameTip}
            name="jobName"
            wrapperCol={{ span: 16 }}
          >
            <Input placeholder={texts.jobnameTip} />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 10 }}>
            <Button
              loading={loading}
              type="primary"
              onClick={handleSubmit}
              block
            >
              {texts.submitBtn}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </GridContent>
  );
};

export default Task;