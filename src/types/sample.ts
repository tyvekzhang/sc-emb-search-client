export interface SamplePage {

    /** 主键 */
    id: string;

    /** 物种 */
    species: string;

    /** 样本名 */
    sample_id: string;

    /** 项目名 */
    project_id: string;

    /** 组织、器官 */
    tissue: string;

    /** 细胞数 */
    cell_count: number;

    /** 项目标题 */
    project_title: string;

    /** 项目总结 */
    project_summary: string;

    /** 测序平台 */
    platform: string;

    /** 扩展字段 */
    ext: string;

    /** 创建时间 */
    create_time: string;

}

export interface SampleCreate {

    /** 物种 */
    species: string;

    /** 样本名 */
    sample_id: string;

    /** 项目名 */
    project_id: string;

    /** 组织、器官 */
    tissue: string;

    /** 细胞数 */
    cell_count: number;

    /** 项目标题 */
    project_title: string;

    /** 项目总结 */
    project_summary: string;

    /** 测序平台 */
    platform: string;

    /** 扩展字段 */
    ext: string;

}

export interface SampleQuery {

    /** 主键 */
    id: string;

    /** 物种 */
    species: string;

    /** 组织、器官 */
    tissue: string;

    /** 细胞数 */
    cell_count: number;

    /** 项目标题 */
    project_title: string;

    /** 项目总结 */
    project_summary: string;

    /** 测序平台 */
    platform: string;

    /** 扩展字段 */
    ext: string;

    /** 创建时间 */
    create_time: string;

}

export interface SampleModify {

    /** 主键 */
    id: string;

    /** 物种 */
    species: string;

    /** 样本名 */
    sample_id: string;

    /** 项目名 */
    project_id: string;

    /** 组织、器官 */
    tissue: string;

    /** 细胞数 */
    cell_count: number;

    /** 项目标题 */
    project_title: string;

    /** 项目总结 */
    project_summary: string;

    /** 测序平台 */
    platform: string;

    /** 扩展字段 */
    ext: string;

}

export interface SampleBatchModify {
    /** 主键列表 */
    ids: string[];

    /** 物种 */
    species: string;

    /** 样本名 */
    sample_id: string;

    /** 项目名 */
    project_id: string;

    /** 组织、器官 */
    tissue: string;

    /** 细胞数 */
    cell_count: number;

    /** 项目标题 */
    project_title: string;

    /** 项目总结 */
    project_summary: string;

    /** 测序平台 */
    platform: string;

    /** 扩展字段 */
    ext: string;

}

export interface SampleDetail {

    /** 主键 */
    id: string;

    /** 物种 */
    species: string;

    /** 样本名 */
    sample_id: string;

    /** 项目名 */
    project_id: string;

    /** 组织、器官 */
    tissue: string;

    /** 细胞数 */
    cell_count: number;

    /** 项目标题 */
    project_title: string;

    /** 项目总结 */
    project_summary: string;

    /** 测序平台 */
    platform: string;

    /** 扩展字段 */
    ext: string;

    /** 创建时间 */
    create_time: string;

}