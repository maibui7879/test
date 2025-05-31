import React, { useState, useEffect, useCallback } from 'react';
import { getAllTaskUser, updateTask, deleteTask } from '@services/taskServices';
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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTasks, setTotalTasks] = useState(0);

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAllTaskUser({
                page: currentPage,
                limit: 10,
            });

            if (response?.personalTasks) {
                const sortedTasks = [...response.personalTasks].sort(
                    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
                );
                setTasks(sortedTasks);
                setTotalTasks(response.totalItems || response.personalTasks.length);
            } else {
                throw new Error('Định dạng dữ liệu không hợp lệ');
            }
        } catch (err: any) {
            console.error('Error fetching tasks:', err);
            const errorMessage = err.message || 'Không thể tải danh sách công việc';
            setError(errorMessage);
            toast.error(errorMessage, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleUpdateTask = useCallback(async (taskData: TaskPayload) => {
        try {
            if (!taskData.id && !taskData._id) {
                throw new Error('Không tìm thấy ID của công việc để cập nhật');
            }
            const taskId = taskData.id || taskData._id;

            let numericId: number;
            if (typeof taskId === 'string') {
                numericId = parseInt(taskId, 10);
                if (isNaN(numericId)) {
                    throw new Error('ID công việc không hợp lệ');
                }
            } else if (typeof taskId === 'number') {
                numericId = taskId;
            } else {
                throw new Error('Định dạng ID công việc không hợp lệ');
            }

            await updateTask(numericId, taskData);
            setTasks((prevTasks) =>
                prevTasks.map((task) => (task.id === taskId || task._id === taskId ? taskData : task)),
            );
            toast.success('Cập nhật công việc thành công!');
        } catch (err: any) {
            console.error('Error updating task:', err);
            toast.error(err.message || 'Không thể cập nhật công việc');
        }
    }, []);

    const handleDeleteTask = useCallback(
        async (taskId: string | number) => {
            try {
                const numericId = typeof taskId === 'string' ? parseInt(taskId, 10) : taskId;
                if (isNaN(numericId)) {
                    throw new Error('ID công việc không hợp lệ');
                }
                await deleteTask(numericId);
                toast.success('Xóa công việc thành công!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                await fetchTasks();
            } catch (err: any) {
                console.error('Error deleting task:', err);
                toast.error(err.message || 'Không thể xóa công việc', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        },
        [fetchTasks],
    );

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

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
                onDeleteTask={handleDeleteTask}
                currentPage={currentPage}
                totalTasks={totalTasks}
                onPageChange={handlePageChange}
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
                <TaskForm onTaskCreated={fetchTasks} onClose={() => setIsModalVisible(false)} />
            </Modal>
        </div>
    );
}

export default PersonalTask;
