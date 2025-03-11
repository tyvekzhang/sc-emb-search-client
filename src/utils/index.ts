export type optionType = {
  label: string;
  value: number;
};

export const filterOperate = (input: string, option?: optionType) => {
  return (
    option !== undefined &&
    option.label.toLowerCase().includes(input.toLowerCase())
  );
};

export function transformOptions(data: any) {
  return data.map((item:any) => {
    return Object.assign(
      {},
      {
        label: item.sample_id,
        value: item.id,
      },
    );
  });
}

export type taskType = {
  jobId: number;
  jobName: string;
  cellCount: number;
  status: number;
  gmtCreate: string;
};

export const TASK_KEY = 'CELL_EMB_SEARCH_KEY';
export function getJobTask(): taskType[] | null {
  const cache = localStorage.getItem(TASK_KEY);
  if (cache) {
    return JSON.parse(cache);
  }
  return null;
}

export function setJobTask(obj: taskType) {
  const cache = getJobTask();
  let res = [obj];
  if (cache) {
    res = [obj, ...cache];
  }
  localStorage.setItem(TASK_KEY, JSON.stringify(res));
}

export function clone<T>(o: T): T {
  return JSON.parse(JSON.stringify(o));
}

export function delIndexTask(idx: number) {
  const cache = getJobTask();
  if (cache) {
    cache.splice(idx, 1);
    localStorage.setItem(TASK_KEY, JSON.stringify(cache));
  }
}
