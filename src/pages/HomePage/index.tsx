import React, { useState, useEffect } from 'react';
import { getAllTaskUser } from '../../services/taskServices'; // Import getAllTaskUser service
import { TaskPayload } from '../../services/types/types'; // Import TaskPayload type
import TaskItem from '../../components/TaskItem'; // Import TaskItem (assuming it exists)
import TaskListSection from '../../components/TaskListSection'; // Import TaskListSection (assuming it exists)
import TaskForm from '../../components/TaskForm';
import { Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

function Home() {
    const [tasks, setTasks] = useState<TaskPayload[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await getAllTaskUser();
            if (response && Array.isArray(response)) {
                setTasks(response);
            } else {
                throw new Error('Invalid response format');
            }
            setLoading(false);
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to load tasks';
            setError(errorMessage);
            message.error(errorMessage);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSuccess = () => {
        setIsModalVisible(false);
        fetchTasks();
    };

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
            </div>
        );
    }

    return (
        <div className="p-5 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl m-0 text-gray-700">Danh sách công việc</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                    Thêm công việc mới
                </Button>
            </div>

            <TaskListSection title="Tất cả công việc">
                {tasks.length > 0 ? (
                    tasks.map((task) => <TaskItem key={task.id || task._id || Math.random().toString()} task={task} />)
                ) : (
                    <div className="text-center p-5 text-gray-600 italic">Không có công việc nào.</div>
                )}
            </TaskListSection>

            <Modal title="Thêm công việc mới" open={isModalVisible} onCancel={handleCancel} footer={null} width={700}>
                <TaskForm onSuccess={handleSuccess} />
            </Modal>
        </div>
    );
}

export default Home;
