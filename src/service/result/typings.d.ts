declare namespace ResultTaskType {
  type JobResType = {
    data: {
      status: 'waiting' | 'executing' | 'completed' | 'out_time'; //计算任务执行状态：waiting, executing, completed, out_time
      runStatus: number; //计算任务结果状态：0-运行成功。-1-未出结果，其他值-运行失败。
      resultList?: JobType[];
      resultFile?: string;
      log?: string;
    };
  } & API.Response;

  type JobType = {
    id: number;
  };
}
