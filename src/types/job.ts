export interface CellEmbResult {
    index: number
    study: string
    sample: string
    prediction: string
    tissue: string
    cell_line: string
    disease: string
}

export interface JobPage {
    
    /** 主键 */
    id: string;
    
    /** 任务名称 */
    job_name: string;
    
    /** 父任务号 */
    parent_job_id: string;
    
    /** 状态 */
    status: number;
    
    /** 描述 */
    comment: string;
    
    /** 创建时间 */
    creat_time: string;
    
}

export interface JobCreate {
    
    /** 任务名称 */
    job_name: string;
    
    /** 父任务号 */
    parent_job_id: string;
    
    /** 状态 */
    status: number;
    
    /** 描述 */
    comment: string;
    
    /** 创建时间 */
    creat_time: string;
    
}

export interface JobSubmit {
    /** 任务名称 */
    job_name?: string;

    /** 任务类型 */
    job_type: number;

    /** 文件信息 */
    file_info: string;

    /** 单元格索引 */
    cell_index?: string;

    /** 结果单元格数量 */
    result_cell_count: number;
}

export interface JobQuery {
    
    /** 主键 */
    id: string;
    
    /** 任务名称 */
    job_name: string;
    
    /** 状态 */
    status: number;
    
    /** 创建时间 */
    creat_time: string;
    
}

export interface JobModify {
    
    /** 主键 */
    id: string;
    
    /** 任务名称 */
    job_name: string;
    
    /** 父任务号 */
    parent_job_id: string;
    
    /** 状态 */
    status: number;
    
    /** 描述 */
    comment: string;
    
    /** 创建时间 */
    creat_time: string;
    
}

export interface JobBatchModify {
    /** 主键列表 */
    ids: string[];
    
    /** 任务名称 */
    job_name: string;
    
    /** 父任务号 */
    parent_job_id: string;
    
    /** 状态 */
    status: number;
    
    /** 描述 */
    comment: string;
    
    /** 创建时间 */
    creat_time: string;
    
}

export interface JobDetail {
    
    /** 主键 */
    id: string;
    
    /** 任务名称 */
    job_name: string;
    
    /** 父任务号 */
    parent_job_id: string;
    
    /** 状态 */
    status: number;
    
    /** 描述 */
    comment: string;
    
    /** 创建时间 */
    creat_time: string;
    
}