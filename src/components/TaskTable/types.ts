import { ColumnsType } from 'antd/es/table';
import { TaskPayload, UserProfile } from '@services/types/types';

interface BaseTaskProps {
    loading: boolean;
    error: string | null;
    onReload: () => void;
    currentPage: number;
    totalTasks: number;
    onPageChange: (page: number) => void;
    teamId?: string | null;
    onEditTask: (task: TaskPayload) => Promise<void>;
    onDeleteTask: (taskId: string | number) => Promise<void>;
    onAssignTask?: ((taskId: number, memberId: number) => Promise<void>) | undefined;
    teamMembers?: UserProfile[];
}

export interface TaskTableProps extends BaseTaskProps {
    tasks: TaskPayload[];
}

export interface TaskTableContentProps extends BaseTaskProps {
    searchText: string;
    setSearchText: (text: string) => void;
    filteredTasks: TaskPayload[];
    columns: ColumnsType<TaskPayload>;
}
