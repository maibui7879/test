import React, { useState } from 'react';
import TaskInputForm from '../../components/TaskInputForm'; // Import TaskInputForm
import { createTask } from '../../services/taskServices'; // Import createTask service
import { TaskPayload } from '../../services/types/types'; // Import TaskPayload type
import { message } from 'antd'; // Assuming Ant Design message for notifications
import { useNavigate } from 'react-router-dom'; // For navigation

function CreateTaskPage() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAddTask = async (taskData: { title: string; description?: string }) => {
        try {
            setLoading(true);
            // Gọi service createTask
            // API expects TaskPayload, so we need to structure the data accordingly.
            // Assuming TaskPayload has 'title' and 'description'. Other fields might be needed based on API spec.
            const payload: TaskPayload = {
                ...taskData,
                // Add required fields with default/placeholder values
                start_time: new Date().toISOString(), // Example: current time as start_time
                end_time: '', // Corrected: use empty string for end_time if it's optional string
                status: 'todo', // Example: default status is 'todo'
                priority: 'low', // Corrected: use 'low' as default priority string
            };
            await createTask(payload);
            setLoading(false);
            message.success('Task added successfully!'); // Show success message
            navigate('/home'); // Navigate back to home page after success
        } catch (error: any) {
            setLoading(false);
            message.error(`Failed to add task: ${error.message}`); // Show error message
        }
    };

    return (
        <div>
            <h1>Trang Thêm Nhiệm vụ</h1>
            {/* Render TaskInputForm and pass handleAddTask as prop */}
            <TaskInputForm onAddTask={handleAddTask} loading={loading} />
        </div>
    );
}

export default CreateTaskPage;
