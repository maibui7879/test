import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TaskPayload, UserProfile } from '@services/types/types';
import TaskForm from '@components/TaskForm';
import TaskTable from '@components/TaskTable';
import getAllTaskTeam from '@services/taskServices/getAllTaskTeam';
import { updateTask, deleteTask } from '@services/taskServices';
import { getMembersTeam } from '@services/teamServices';
import { useMessage } from '@hooks/useMessage';
import { TeamMemberInfo } from '@services/teamServices/teamMembers/getMembersTeam';
import { TeamStatistics } from '@services/teamServices/getTeamStatistics';

interface TasksProps {
    teamId: string | undefined;
    onTaskChange?: () => void;
}

const Tasks: React.FC<TasksProps> = ({ teamId, onTaskChange }) => {
    const { message, contextHolder } = useMessage();
    const [tasks, setTasks] = useState<TaskPayload[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTasks, setTotalTasks] = useState(0);
    const [teamMembers, setTeamMembers] = useState<UserProfile[]>([]);

    const fetchTeamMembers = useCallback(async () => {
        try {
            const response = await getMembersTeam(Number(teamId));
            if (Array.isArray(response)) {
                const convertedMembers: UserProfile[] = response.map((member: TeamMemberInfo) => ({
                    id: member.id,
                    full_name: member.full_name,
                    role: member.role,
                    avatar_url: '',
                    email: member.full_name.toLowerCase().replace(/\s+/g, '') + '@example.com',
                }));
                setTeamMembers(convertedMembers);
            } else {
                throw new Error('Dữ liệu thành viên không hợp lệ');
            }
        } catch (error) {
            console.error('Error fetching team members:', error);
            message.error({ key: 'fetch-team-members-error', content: 'Không thể lấy danh sách thành viên' });
        }
    }, [teamId, message]);

    const fetchTasks = useCallback(async () => {
        if (!teamId) return;
        const key = 'fetchTasks';
        try {
            setLoading(true);
            const response = await getAllTaskTeam(teamId, {
                page: currentPage,
                limit: 10,
            });

            if (response?.tasksTeam) {
                const sortedTasks = [...response.tasksTeam].sort(
                    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
                );
                setTasks(sortedTasks);
                setTotalTasks(response.totalItems || response.tasksTeam.length);
                if (onTaskChange) {
                    onTaskChange();
                }
            } else {
                throw new Error('Dữ liệu không hợp lệ');
            }
        } catch (err: any) {
            console.error('Error fetching tasks:', err);
            const errorMessage = err.message || 'Không thể tải danh sách công việc';
            setError(errorMessage);
            message.error({ key, content: errorMessage });
        } finally {
            setLoading(false);
        }
    }, [teamId, currentPage, message, onTaskChange]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleUpdateTask = useCallback(
        async (taskData: TaskPayload) => {
            const key = 'updateTask';
            try {
                if (!taskData.id) {
                    throw new Error('Không tìm thấy ID công việc');
                }
                const taskId = taskData.id;

                let numericId: number;
                if (typeof taskId === 'string') {
                    numericId = parseInt(taskId, 10);
                    if (isNaN(numericId)) {
                        throw new Error('ID công việc không hợp lệ');
                    }
                } else if (typeof taskId === 'number') {
                    numericId = taskId;
                } else {
                    throw new Error('ID công việc không hợp lệ');
                }

                message.loading({ key, content: 'Đang cập nhật công việc...' });

                const updatedTaskData: TaskPayload = {
                    ...taskData,
                    team_id: teamId || '',
                };

                await updateTask(numericId, updatedTaskData);
                setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? updatedTaskData : task)));
                message.success({ key, content: 'Cập nhật công việc thành công!' });
                if (onTaskChange) {
                    onTaskChange();
                }
            } catch (err: any) {
                console.error('Error updating task:', err);
                message.error({ key, content: err.message || 'Không thể cập nhật công việc' });
            }
        },
        [teamId, message, onTaskChange],
    );

    const handleDeleteTask = useCallback(
        async (taskId: string | number) => {
            const key = 'deleteTask';
            try {
                const numericId = typeof taskId === 'string' ? parseInt(taskId, 10) : taskId;
                if (isNaN(numericId)) {
                    throw new Error('ID công việc không hợp lệ');
                }
                message.loading({ key, content: 'Đang xóa công việc...' });
                await deleteTask(numericId);
                setTasks((prevTasks) =>
                    prevTasks.filter((task) => {
                        const id = task.id;
                        return id !== taskId;
                    }),
                );
                setTotalTasks((prev) => prev - 1);
                message.success({ key, content: 'Xóa công việc thành công!' });
                if (onTaskChange) {
                    onTaskChange();
                }
            } catch (err: any) {
                console.error('Error deleting task:', err);
                message.error({ key, content: err.message || 'Không thể xóa công việc' });
            }
        },
        [message, onTaskChange],
    );

    useEffect(() => {
        fetchTasks();
        fetchTeamMembers();
    }, [fetchTasks, fetchTeamMembers]);

    return (
        <div className="h-full p-6">
            {contextHolder}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-800 m-0">Danh sách công việc</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalVisible(true)}
                    className="flex items-center"
                >
                    Thêm công việc
                </Button>
            </div>

            <TaskTable
                tasks={tasks}
                loading={loading}
                error={error}
                onReload={fetchTasks}
                onEditTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                currentPage={currentPage}
                totalTasks={totalTasks}
                onPageChange={handlePageChange}
                teamId={teamId}
                teamMembers={teamMembers}
            />

            <Modal
                title={
                    <div className="flex items-center">
                        <PlusOutlined className="mr-2" />
                        Thêm công việc
                    </div>
                }
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={700}
                className="task-modal"
            >
                <TaskForm
                    onTaskCreated={() => {
                        fetchTasks();
                        setIsModalVisible(false);
                    }}
                    onClose={() => setIsModalVisible(false)}
                    teamId={teamId}
                />
            </Modal>
        </div>
    );
};

export default Tasks;
