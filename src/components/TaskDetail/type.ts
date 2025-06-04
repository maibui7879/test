import { TaskPayload } from '@services/types/types';

export interface TaskDetailsProps {
    task: TaskPayload;
    onEditTask: (taskData: TaskPayload) => Promise<void>;
    onDeleteTask: (taskId: string | number) => Promise<void>;
    onReload?: () => void;
    teamId?: string | null;
}
