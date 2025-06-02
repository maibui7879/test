import { ColumnsType } from 'antd/es/table';
import { TaskPayload } from '@services/types/types';

interface BaseTaskProps {
    loading: boolean;
    error: string | null;
    onReload: () => void;
}

export interface TaskTableProps extends BaseTaskProps {
    tasks: TaskPayload[];
    onEditTask: (task: TaskPayload) => Promise<void>;
    onDeleteTask: (taskId: string | number) => Promise<void>;
    currentPage: number;
    totalTasks: number;
    onPageChange: (page: number) => void;
    setTotalTasks: (value: number) => void;
}

export interface TaskTableContentProps extends BaseTaskProps {
    searchText: string;
    setSearchText: (text: string) => void;
    filteredTasks: TaskPayload[];
    columns: ColumnsType<TaskPayload>;
    currentPage: number;
    totalTasks: number;
    onPageChange: (page: number) => void;
}
