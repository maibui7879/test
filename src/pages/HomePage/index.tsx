import React, { useState, useEffect } from 'react';
import { getAllTaskUser } from '../../services/taskServices'; // Import getAllTaskUser service
import { TaskPayload } from '../../services/types/types'; // Import TaskPayload type
import TaskItem from '../../components/TaskItem'; // Import TaskItem (assuming it exists)
import TaskListSection from '../../components/TaskListSection'; // Import TaskListSection (assuming it exists)
import TaskForm from '../../components/TaskForm';
import { Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './styles.css';

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
            <div className="loading-container">
                <div className="loading-spinner" />
                <p>Đang tải danh sách công việc...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Lỗi</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="home-container">
            <div className="header-section">
                <h1 className="page-title">Danh sách công việc</h1>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={showModal}
                >
                    Thêm công việc mới
                </Button>
            </div>

            <TaskListSection title="Tất cả công việc">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TaskItem 
                            key={task.id || task._id || Math.random().toString()} 
                            task={task}
                        />
                    ))
                ) : (
                    <div className="no-tasks-message">
                        Không có công việc nào.
                    </div>
                )}
            </TaskListSection>

            <Modal
                title="Thêm công việc mới"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={700}
            >
                <TaskForm onSuccess={handleSuccess} />
            </Modal>
        </div>
    );
}

export default Home;
