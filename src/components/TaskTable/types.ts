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

export interface TaskTableContentProps {
    tasks: TaskPayload[];
    loading: boolean;
    error: string | null;
    onReload: () => void;
    onEditTask: (task: TaskPayload) => Promise<void>;
    onDeleteTask: (taskId: string | number) => Promise<void>;
    onAssignTask?: (taskId: number, memberId: number) => Promise<void>;
    currentPage: number;
    totalTasks: number;
    onPageChange: (page: number) => void;
    teamId?: string;
    teamMembers?: UserProfile[];
    onTaskCreated?: () => void;
    onFilter?: (values: any) => void;
}

export interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onFilter: (values: any) => void;
    teamMembers?: UserProfile[];
}
