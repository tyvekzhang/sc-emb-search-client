const tissues = [
  { id: 0, name: 'blood' },
  { id: 1, name: 'bone_marrow', disabled: true },
  { id: 2, name: 'lung', disabled: true },
];

const anno_result = {
  status: 'completed',
  runStatus: 0,
  resultList: [
    { name: 'alpha', cellcount: 500, percent: 25 },
    { name: 'beta', cellcount: 500, percent: 25 },
    { name: 'ductal', cellcount: 200, percent: 10 },
  ],
};

function getCurrentTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const job_result = {
  jobId: 'mEcJYtQYm6',
  jobName: '',
  gmtCreate: getCurrentTime(),
  cellCount: 2000,
};

export default {
  'GET /api/v1/listTissue': (req: any, res: any) => {
    res.json({
      msg: 'success',
      data: tissues,
      code: 0,
    });
  },
  'GET /api/v1/job/getRequest': (req: any, res: any) => {
    res.json({
      msg: 'success',
      data: anno_result,
      code: 0,
    });
  },

  'POST /api/v1/job/create': (req: any, res: any) => {
    res.json({
      msg: 'success',
      data: job_result,
      code: 0,
    });
  },
};
