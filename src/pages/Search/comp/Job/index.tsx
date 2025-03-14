import { CloudOutlined, InboxOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import { useIntl } from '@umijs/max';
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Select,
  Slider,
  Tabs,
  Upload,
} from 'antd';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import type { RcFile, UploadRequestOption } from 'rc-upload/lib/interface';
import React, { useEffect, useState } from 'react';

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
import { fetchAllSampleBySpecies } from '@/service/sample';

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
    model: intl.formatMessage({
      id: 'pages.search.reference.model',
    }),
    selectReference: intl.formatMessage({ id: 'pages.search.select' }),
    selectFromBuiltIn: intl.formatMessage({ id: 'pages.search.builtIn' }),
    uploadTip: intl.formatMessage({ id: 'pages.search.upload.tip' }),
    h5adTip: intl.formatMessage({ id: 'pages.search.label.h5ad.tip' }),
    cellCount: intl.formatMessage({ id: 'pages.search.label.cellCount' }),
    cellIndex: intl.formatMessage({ id: 'pages.search.label.cellIndex' }),
    barcodeIndex: intl.formatMessage({ id: 'pages.search.label.barcodeIndex' }),
    cellIndexTip: intl.formatMessage({ id: 'pages.search.label.cellIndexTip' }),
    barcodeTip: intl.formatMessage({ id: 'pages.search.label.barcodeTip' }),
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

  const handleSelectReference = async (_value: any, option: any) => {
    setSpecies(option.value);
    if (activeTab === '2') {
      const resp = await fetchAllSampleBySpecies(option.value);
      const transformedOptions = transformOptions(resp);
      setOptions(transformedOptions);
    }
  };

  useEffect(() => {
    handleSelectReference("", { value: species })
  }, [activeTab]);

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
        model: 1,
        job_name: "",
        job_type: 1,
        file_info: "",
        cell_index: undefined,
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

      if (values.model) {
        data.model = values.model;
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
          status: 2,
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

  const indexOptions: CheckboxGroupProps<string>['options'] = [
    { label: texts.cellIndex , value: '1' },
    { label: texts.barcodeIndex, value: '2' },
  ];

  const modelOptions: CheckboxGroupProps<string>['options'] = [
    { label: "Scimilarity" , value: '1' },
    { label: "Geneformer", value: '2' },
  ];

  const [indexType, setIndexType] = useState('1');
  const [modelName, setModelName] = useState('1');

  useEffect(() => {
    form.setFieldsValue({
      model: modelName,
    });
  }, []);
  return (
    <GridContent>
      <Card bordered={false}>
        <Form layout="vertical" form={form}>
          <Form.Item
              label={texts.model}
              name="model"
              rules={[{ required: true, message: texts.require }]}
              className="-mt-4"
          >
            <Radio.Group
                options={modelOptions}
                defaultValue={modelName}
                onChange={(e) => setModelName(e.target.value)}
                optionType="button"
                buttonStyle="solid"
            />
          </Form.Item>
          <Form.Item
              label={texts.referenceSpecies}
              name="specie"
              rules={[{ required: true, message: texts.require }]}
              className={"w-2/3"}
          >
            <Select
                showSearch
                style={{ width: '100%' }}
                placeholder={texts.selectReference}
                onChange={handleSelectReference}
                options={[
                  { value: '1', label: 'Homo sapiens' },
                  { value: '2', label: 'Mouse', disabled: true },
                ]}
                filterOption={filterOperate as any}
            />
          </Form.Item>
          <Tabs
            defaultActiveKey="1"
            onChange={handleTabChange}
            className="w-2/3 -mt-2"
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
          <Radio.Group
              options={indexOptions}
              defaultValue={indexType}
              onChange={(e) => setIndexType(e.target.value)}
              optionType="button"
              buttonStyle="solid"
              className="mb-2"
          />
          <Form.Item
            wrapperCol={{ span: 16 }}
            // label={indexType === '1' ? texts.cellIndex : texts.barcodeTip}
            name="cellIndex"
          >
            { indexType === '1' ? <Input placeholder={texts.cellIndexTip} /> : <Input placeholder={texts.barcodeTip} />}
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