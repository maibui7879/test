import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getAllTaskUser, updateTask, deleteTask } from '@services/taskServices';
import { TaskPayload } from '@services/types/types';
import TaskForm from '@components/TaskForm';
import TaskTable from '@components/TaskTable';
import { Button, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import useNotification from '@components/Notification';

function PersonalTask() {
    const [tasks, setTasks] = useState<TaskPayload[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTasks, setTotalTasks] = useState(0);
    const notification = useNotification();
    const notificationRef = useRef(notification);

    useEffect(() => {
        notificationRef.current = notification;
    }, [notification]);

    const fetchTasks = useCallback(async () => {
        const key = 'fetchTasks';
        try {
            setLoading(true);
            notificationRef.current.loading(key, 'Đang tải danh sách công việc...');
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
                notificationRef.current.success(key, 'Tải danh sách công việc thành công!');
            } else {
                throw new Error('Dữ liệu không hợp lệ');
            }
        } catch (err: any) {
            console.error('Error fetching tasks:', err);
            const errorMessage = err.message || 'Không thể tải danh sách công việc';
            setError(errorMessage);
            notificationRef.current.error(key, errorMessage);
        } finally {
            setLoading(false);
        }
    }, [currentPage]); // Remove notification from dependencies

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleUpdateTask = useCallback(async (taskData: TaskPayload) => {
        const key = 'updateTask';
        try {
            if (!taskData.id && !taskData._id) {
                throw new Error('Không tìm thấy ID công việc');
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
                throw new Error('ID công việc không hợp lệ');
            }

            notificationRef.current.loading(key, 'Đang cập nhật công việc...');
            await updateTask(numericId, taskData);
            setTasks((prevTasks) =>
                prevTasks.map((task) => (task.id === taskId || task._id === taskId ? taskData : task)),
            );
            notificationRef.current.success(key, 'Cập nhật công việc thành công!');
        } catch (err: any) {
            console.error('Error updating task:', err);
            notificationRef.current.error(key, err.message || 'Không thể cập nhật công việc');
        }
    }, []); // Remove notification from dependencies

    const handleDeleteTask = useCallback(async (taskId: string | number) => {
        const key = 'deleteTask';
        try {
            const numericId = typeof taskId === 'string' ? parseInt(taskId, 10) : taskId;
            if (isNaN(numericId)) {
                throw new Error('ID công việc không hợp lệ');
            }
            notificationRef.current.loading(key, 'Đang xóa công việc...');
            await deleteTask(numericId);
            setTasks((prevTasks) =>
                prevTasks.filter((task) => {
                    const id = task.id || task._id;
                    return id !== taskId;
                }),
            );
            setTotalTasks((prev) => prev - 1);
            notificationRef.current.success(key, 'Xóa công việc thành công!');
        } catch (err: any) {
            console.error('Error deleting task:', err);
            notificationRef.current.error(key, err.message || 'Không thể xóa công việc');
        }
    }, []); // Remove notification from dependencies

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return (
        <div className="h-full">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-800 m-0">Danh sách công việc</h1>
                <Button
                    type="primary"
                    icon={<FontAwesomeIcon icon={faPlus} />}
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
                setTotalTasks={setTotalTasks}
            />

            <Modal
                title={
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Thêm công việc
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
