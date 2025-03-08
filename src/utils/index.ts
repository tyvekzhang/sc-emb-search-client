export type optionType = {
  label: string;
  value: number;
};

export const filterOperate = (input: string, option?: optionType) => {
  return (
    option?.label.toLocaleLowerCase().includes(input.toLocaleLowerCase()) ||
    false
  );
};

export function transformOptions(data: AnnoType.TissueType[]) {
  return data.map((item) => {
    return Object.assign(
      {},
      {
        label: item.name,
        value: item.id,
        disabled: item.disabled,
      },
    );
  });
}

export type taskType = {
  jobId: string;
  jobName: string;
  cellCount: number;
  gmtCreate: string;
};

const TASK_KEY = 'ANNOTATION_KEY';
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
