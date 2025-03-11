declare namespace ResultTaskType {
  type JobResType = {
    status: 1 | 2 | 3 | 4; //计算任务执行状态：waiting, executing, completed, out_time
    records?: any;
    total?: number;
  } & API.Response;

  type JobType = {
    id: number;
  };
}
