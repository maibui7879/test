import React, { useState, useEffect } from 'react';
import { getAllTaskUser, createTask, updateTask, deleteTask } from '@services/taskServices';
import { TaskPayload } from '@services/types/types';
import TaskItem from '@components/TaskItem';
import TaskListSection from '@components/TaskListSection';
import TaskForm from '@components/TaskForm';
import { Button, Modal, message, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

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
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (taskData: TaskPayload) => {
        try {
            await createTask(taskData);
            message.success('Tạo công việc thành công!');
            setIsModalVisible(false);
            await fetchTasks();
        } catch (err: any) {
            message.error(err.message || 'Không thể tạo công việc');
        }
    };

    const handleUpdateTask = async (taskId: string | number, taskData: TaskPayload) => {
        try {
            const numericId = typeof taskId === 'string' ? parseInt(taskId, 10) : taskId;
            if (isNaN(numericId)) {
                throw new Error('Invalid task ID');
            }
            const updatedTaskData: TaskPayload = {
                ...taskData,
                title: taskData.title,
                start_time: taskData.start_time,
                end_time: taskData.end_time,
                status: taskData.status,
                priority: taskData.priority,
            };
            await updateTask(numericId, updatedTaskData);
            message.success('Cập nhật công việc thành công!');
            await fetchTasks();
        } catch (err: any) {
            message.error(err.message || 'Không thể cập nhật công việc');
        }
    };

    const handleDeleteTask = async (taskId: string | number) => {
        try {
            const numericId = typeof taskId === 'string' ? parseInt(taskId, 10) : taskId;
            if (isNaN(numericId)) {
                throw new Error('Invalid task ID');
            }
            await deleteTask(numericId);
            message.success('Xóa công việc thành công!');
            await fetchTasks();
        } catch (err: any) {
            message.error(err.message || 'Không thể xóa công việc');
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[200px]">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4" />
                    <p>Đang tải danh sách công việc...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="p-5 bg-red-50 border border-red-200 rounded-md my-5">
                    <h2 className="text-red-500 mb-2.5">Lỗi</h2>
                    <p>{error}</p>
                    <Button type="primary" onClick={fetchTasks}>
                        Thử lại
                    </Button>
                </div>
            );
        }

        return (
            <TaskListSection title="Tất cả công việc">
                {tasks.length > 0 ? (
                    tasks.map((task) => {
                        const taskId = task.id || task._id;
                        if (!taskId) return null;

                        return (
                            <TaskItem
                                key={taskId}
                                task={task}
                                onUpdate={(taskData) => handleUpdateTask(taskId, taskData)}
                                onDelete={() => handleDeleteTask(taskId)}
                            />
                        );
                    })
                ) : (
                    <Empty description="Không có công việc nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
            </TaskListSection>
        );
    };

    return (
        <div className="p-5 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl m-0 text-gray-700">Danh sách công việc</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                    Thêm công việc mới
                </Button>
            </div>

            {renderContent()}

            <Modal
                title="Thêm công việc mới"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={700}
            >
                <TaskForm onSuccess={handleCreateTask} />
            </Modal>
        </div>
    );
}

export default PersonalTask;
