import React, { useState, useEffect } from 'react';
import { TaskPayload } from '../../services/types/types';
import { Card, Tag, Space, Modal, Button, message, Select } from 'antd';
import { ClockCircleOutlined, FlagOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import TaskForm from '../TaskForm';
import './styles.css';

interface TaskItemProps {
    task: TaskPayload;
    onUpdate?: (updatedTask: TaskPayload) => void;
    onDelete?: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentTask, setCurrentTask] = useState<TaskPayload>(task);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'red';
            case 'medium':
                return 'orange';
            case 'low':
                return 'green';
            default:
                return 'blue';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'todo':
                return 'default';
            case 'in_progress':
                return 'processing';
            case 'done':
                return 'success';
            default:
                return 'default';
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSuccess = async () => {
        setIsModalVisible(false);
    };

    const handleComplete = async () => {
        try {
            const updatedTask: TaskPayload = {
                ...currentTask,
                status: 'done' as const,
            };
            setCurrentTask(updatedTask);
            if (onUpdate) {
                await onUpdate(updatedTask);
                message.success('Đã đánh dấu công việc hoàn thành!');
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi cập nhật trạng thái');
        }
    };

    const formatDateTime = (dateString: string) => {
        return dayjs(dateString).format('DD/MM/YYYY HH:mm');
    };

    return (
        <>
            <Card className="task-item" style={{ marginBottom: '16px', cursor: 'pointer' }} onClick={showModal}>
                <div className="task-header">
                    <h3 style={{ margin: 0 }}>{currentTask.title}</h3>
                    <Space>
                        <Tag color={getPriorityColor(currentTask.priority)}>
                            <FlagOutlined /> {currentTask.priority}
                        </Tag>
                        <Tag color={getStatusColor(currentTask.status)}>
                            {currentTask.status === 'todo'
                                ? 'Chưa thực hiện'
                                : currentTask.status === 'in_progress'
                                  ? 'Đang thực hiện'
                                  : 'Hoàn thành'}
                        </Tag>
                    </Space>
                </div>
                {currentTask.description && <p className="task-description">{currentTask.description}</p>}
                <div className="task-time">
                    <Space>
                        <ClockCircleOutlined />
                        <span>Bắt đầu: {formatDateTime(currentTask.start_time)}</span>
                        <span>-</span>
                        <span>Kết thúc: {formatDateTime(currentTask.end_time)}</span>
                    </Space>
                </div>
                {currentTask.status !== 'done' && (
                    <div className="task-actions" onClick={(e) => e.stopPropagation()}>
                        <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleComplete}>
                            Hoàn thành
                        </Button>
                    </div>
                )}
            </Card>

            <Modal title="Chỉnh sửa công việc" open={isModalVisible} onCancel={handleCancel} footer={null} width={700}>
                <TaskForm mode="edit" initialValues={currentTask} onSuccess={handleSuccess} />
            </Modal>
        </>
    );
};

export default TaskItem;
