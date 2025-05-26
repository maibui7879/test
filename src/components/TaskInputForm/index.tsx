import React, { useState } from 'react';
import { Button, Input } from 'antd'; // Assuming Ant Design is used for UI

interface TaskInputFormProps {
    onAddTask: (taskData: { title: string; description?: string }) => void;
    loading?: boolean;
}

const TaskInputForm: React.FC<TaskInputFormProps> = ({ onAddTask, loading }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = () => {
        if (title.trim()) {
            onAddTask({ title, description: description.trim() });
            // Clear form after submission (optional, depends on UX)
            setTitle('');
            setDescription('');
        }
    };

    return (
        <div
            style={{
                maxWidth: 500,
                margin: '20px auto',
                padding: '20px',
                border: '1px solid #eee',
                borderRadius: '8px',
            }}
        >
            <h2>Thêm Nhiệm vụ Mới</h2>
            <Input
                placeholder="Tiêu đề nhiệm vụ" // Placeholder dựa trên ảnh
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ marginBottom: '10px' }}
            />
            <Input.TextArea
                placeholder="Mô tả" // Placeholder dựa trên ảnh
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoSize={{ minRows: 3, maxRows: 6 }}
                style={{ marginBottom: '20px' }}
            />
            <Button type="primary" onClick={handleSubmit} loading={loading}>
                Thêm nhiệm vụ
            </Button>
        </div>
    );
};

export default TaskInputForm;

export {}; // Add an empty export to make it a module
