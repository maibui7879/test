import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { TaskPayload, UserProfile } from '@services/types/types';

export interface TaskTableContentProps {
    loading: boolean;
    error: any;
    onReload: () => void;
    searchText: string;
    setSearchText: (text: string) => void;
    filteredTasks: TaskPayload[];
    columns: ColumnsType<TaskPayload>;
    currentPage: number;
    totalTasks: number;
    onPageChange: (page: number) => void;
    teamId?: string;
    onEditTask: (task: TaskPayload) => Promise<void>;
    onDeleteTask: (taskId: string | number) => Promise<void>;
    teamMembers?: UserProfile[];
    onAssignTask?: (taskId: number, userId: number) => Promise<void>;
}

const TaskTableContent = ({
    loading,
    error,
    filteredTasks,
    columns,
    currentPage,
    totalTasks,
    onPageChange,
}: TaskTableContentProps) => (
    <Table
        columns={columns}
        dataSource={filteredTasks}
        loading={loading}
        rowKey="id"
        pagination={{
            current: currentPage,
            total: totalTasks,
            pageSize: 10,
            onChange: onPageChange,
            position: ['bottomCenter'],
        }}
    />
);

export default TaskTableContent;
