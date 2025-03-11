import { CloudOutlined, InboxOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import { useIntl } from '@umijs/max';
import {
  Button,
  Card,
  Divider,
  Form,
  Input, message,
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
import { submitJob } from '@/service/search';

// Utils
import {
  filterOperate,
  type optionType,
  setJobTask,
  transformOptions,
} from '@/utils';
import { JobSubmit } from '@/types/job';
import dayjs from 'dayjs';
import { fetchAllSampleBySpecies, fetchSampleByPage, getSpecieList } from '@/service/sample';
import { BaseQueryImpl } from '@/types';

const { TabPane } = Tabs;

interface TaskProps {
  setKey: (key: string) => void;
}

const Task: React.FC<TaskProps> = ({ setKey }) => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const [species, setSpecies] = useState<string>();
  const [options, setOptions] = useState<optionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [fileInfo, setFileInfo] = useState('')
  const [fileName, setFileName] = useState('')

  // Localized strings
  const texts = {
    inputData: intl.formatMessage({ id: 'pages.search.input.data' }),
    require: intl.formatMessage({ id: 'pages.form.require' }),
    referenceSpecies: intl.formatMessage({
      id: 'pages.search.reference.species',
    }),
    selectReference: intl.formatMessage({ id: 'pages.search.select' }),
    selectFromBuiltIn: intl.formatMessage({ id: 'pages.search.builtIn' }),
    uploadTip: intl.formatMessage({ id: 'pages.search.upload.tip' }),
    h5adTip: intl.formatMessage({ id: 'pages.search.label.h5ad.tip' }),
    cellCount: intl.formatMessage({ id: 'pages.search.label.cellCount' }),
    cellIndex: intl.formatMessage({ id: 'pages.search.label.cellIndex' }),
    cellIndexTip: intl.formatMessage({ id: 'pages.search.label.cellIndexTip' }),
    localFile: intl.formatMessage({ id: 'pages.search.label.localFile' }),
    buildInFile: intl.formatMessage({ id: 'pages.search.label.Built-in-file' }),
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
    form.setFieldsValue({
      cellCount: 1000,
    });
  }, []);

  const handleSelectReference = async (value: any, option: any) => {
    setSpecies(option.value);
    const resp = await fetchAllSampleBySpecies(option.value)
    const transformedOptions = transformOptions(resp)
    setOptions(transformedOptions);
  };

  const handleSelectSample = async (value: any, option: any) => {
    setFileInfo(option.value)
    setFileName(String(option.label) + ".h5ad")
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
          setFileInfo(resp)
          onSuccess?.(file);
        } else {
          onError?.(new Error('Upload Error'));
        }
      })
      .catch((error) => {
        onError?.(error);
      });
    setFileName(file.name)
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values:', values)

      setLoading(true);

      // Handle different data based on active tab
      const data: JobSubmit = {
        job_name: "",
        job_type: 1,
        file_info: "",
        cell_index: "1",
        result_cell_count: 10000,
      };

      if (activeTab === '1' ) {
        data.job_type = 1
        if (fileInfo == null || fileInfo.length === 0) {
          message.error('No file found.');
          return
        }
      } else if (activeTab === '2') {
        data.job_type = 2
        if (fileInfo == null || fileInfo.length === 0) {
          message.error('Please select a sample.');
          return
        }
      }
      data.file_info = String(fileInfo)

      if (values.jobName) {
        data.job_name = values.jobName;
      }

      if (values.cellCount) {
        data.result_cell_count = values.cellCount;
      }

      if (values.cellIndex) {
        data.cell_index = values.cellIndex;
      }

      const res = await submitJob(data);

      if (res) {
        const jobId = res;
        const cellCount = res;
        const gmtCreate = dayjs().format('YYYY-MM-DD HH:mm:ss');
        setFileName("")

        setJobTask({
          jobId,
          jobName: values.jobName || fileName,
          status: 1,
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
            className="w-2/3 -mt-6"
          >
            <TabPane
              tab={
                <span>
                  <InboxOutlined /> {texts.localFile}
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
                  <CloudOutlined /> {texts.buildInFile}
                </span>
              }
              key="2"
            >
              <Form.Item
                label={texts.referenceSpecies}
                name="specie"
                rules={[{ required: true, message: texts.require }]}
              >
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder={texts.selectReference}
                  onChange={handleSelectReference}
                  options={[
                    { value: '1', label: 'Homo sapiens' },
                    { value: '2', label: 'Mouse' },
                  ]}
                  filterOption={filterOperate as any}
                />
              </Form.Item>
              <Form.Item
                label={texts.selectFromBuiltIn}
                name="selectedFile"
                rules={[
                  { required: activeTab === '2', message: texts.require },
                ]}
              >
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Please select"
                  onChange={handleSelectSample}
                  options={options}
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