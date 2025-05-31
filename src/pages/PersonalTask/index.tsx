import React, { useState, useEffect } from 'react';
import { getAllTaskUser, createTask, updateTask, deleteTask } from '@services/taskServices';
import { TaskPayload } from '@services/types/types';
import TaskForm from '@components/TaskForm';
import TaskTable from '@components/TaskTable';
import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

function PersonalTask() {
    const [tasks, setTasks] = useState<TaskPayload[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await getAllTaskUser();

            if (response?.personalTasks) {
                const sortedTasks = [...response.personalTasks].sort(
                    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
                );
                setTasks(sortedTasks);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to load tasks';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTask = async (taskData: TaskPayload) => {
        try {
            if (!taskData.id && !taskData._id) {
                throw new Error('Không tìm thấy ID của công việc để cập nhật');
            }
            const taskId = taskData.id || taskData._id;

            let numericId: number;
            if (typeof taskId === 'string') {
                numericId = parseInt(taskId, 10);
                if (isNaN(numericId)) {
                    throw new Error('Invalid task ID value (string)');
                }
            } else if (typeof taskId === 'number') {
                numericId = taskId;
            } else {
                throw new Error('Invalid task ID type');
            }

            await updateTask(numericId, taskData);
            toast.success('Cập nhật công việc thành công!');
            await fetchTasks();
        } catch (err: any) {
            toast.error(err.message || 'Không thể cập nhật công việc');
        }
    };

    const handleDeleteTask = async (taskId: string | number) => {
        try {
            const numericId = typeof taskId === 'string' ? parseInt(taskId, 10) : taskId;
            if (isNaN(numericId)) {
                throw new Error('Invalid task ID');
            }
            await deleteTask(numericId);
            toast.success('Xóa công việc thành công!');
            await fetchTasks();
        } catch (err: any) {
            toast.error(err.message || 'Không thể xóa công việc');
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="h-full">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-800 m-0">Danh sách công việc</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalVisible(true)}
                    className="flex items-center"
                >
                    Thêm công việc mới
                </Button>
            </div>

            <TaskTable
                tasks={tasks}
                loading={loading}
                error={error}
                onReload={fetchTasks}
                onEditTask={handleUpdateTask}
            />

            <Modal
                title={
                    <div className="flex items-center">
                        <PlusOutlined className="mr-2" />
                        Thêm công việc mới
                    </div>
                }
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={700}
                className="task-modal"
            >
                <TaskForm />
            </Modal>
        </div>
    );
}

export default PersonalTask;
