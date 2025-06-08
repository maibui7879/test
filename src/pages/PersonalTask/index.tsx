import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getAllTaskUser, updateTask, deleteTask } from '@services/taskServices';
import { TaskPayload } from '@services/types/types';
import TaskForm from '@components/TaskForm';
import TaskTable from '@components/TaskTable';
import { Button, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useMessage } from '@/hooks/useMessage';
import dayjs from 'dayjs';

function PersonalTask() {
    const [tasks, setTasks] = useState<TaskPayload[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTasks, setTotalTasks] = useState(0);
    const [filters, setFilters] = useState<any>({});
    const { message, contextHolder } = useMessage();
    const messageRef = useRef(message);

    useEffect(() => {
        messageRef.current = message;
    }, [message]);

    const fetchTasks = useCallback(async () => {
        const key = 'fetchTasks';
        try {
            setLoading(true);
            const response = await getAllTaskUser({
                page: currentPage,
                limit: 10,
                ...filters,
            });

            if (response?.personalTasks) {
                const formattedTasks = response.personalTasks.map((task: TaskPayload) => ({
                    ...task,
                    start_time: dayjs(task.start_time).format('YYYY-MM-DD HH:mm:ss'),
                    end_time: dayjs(task.end_time).format('YYYY-MM-DD HH:mm:ss'),
                }));

                const sortedTasks = [...formattedTasks].sort(
                    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
                );
                setTasks(sortedTasks);
                setTotalTasks(response.totalItems || response.personalTasks.length);
            } else {
                throw new Error('Dữ liệu không hợp lệ');
            }
        } catch (err: any) {
            console.error('Error fetching tasks:', err);
            const errorMessage = err.message || 'Không thể tải danh sách công việc';
            setError(errorMessage);
            messageRef.current.error({ key, content: errorMessage });
        } finally {
            setLoading(false);
        }
    }, [currentPage, filters]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleUpdateTask = useCallback(async (taskData: TaskPayload) => {
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

            messageRef.current.loading({ key, content: 'Đang cập nhật công việc...' });
            await updateTask(numericId, taskData);
            setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? taskData : task)));
            messageRef.current.success({ key, content: 'Cập nhật công việc thành công!' });
        } catch (err: any) {
            console.error('Error updating task:', err);
            messageRef.current.error({ key, content: err.message || 'Không thể cập nhật công việc' });
        }
    }, []);

    const handleDeleteTask = useCallback(async (taskId: string | number) => {
        const key = 'deleteTask';
        try {
            const numericId = typeof taskId === 'string' ? parseInt(taskId, 10) : taskId;
            if (isNaN(numericId)) {
                throw new Error('ID công việc không hợp lệ');
            }
            messageRef.current.loading({ key, content: 'Đang xóa công việc...' });
            await deleteTask(numericId);
            setTasks((prevTasks) =>
                prevTasks.filter((task) => {
                    const id = task.id;
                    return id !== taskId;
                }),
            );
            setTotalTasks((prev) => prev - 1);
            messageRef.current.success({ key, content: 'Xóa công việc thành công!' });
        } catch (err: any) {
            console.error('Error deleting task:', err);
            messageRef.current.error({ key, content: err.message || 'Không thể xóa công việc' });
        }
    }, []);

    const handleFilter = (values: any) => {
        setFilters(values);
        setCurrentPage(1);
    };

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return (
        <div className="h-full p-6">
            {contextHolder}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-800 m-0">Danh sách công việc</h1>
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
                onTaskCreated={() => setIsModalVisible(true)}
                onFilter={handleFilter}
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
