import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllTaskUser } from '@services/taskServices';
import { TaskPayload } from '@services/types/types';
import Calendar from '@components/Calendar';

const CalenderPerson = () => {
    const [tasks, setTasks] = useState<TaskPayload[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                const response = await getAllTaskUser({ page: 1, limit: 1000000 });
                const data = response?.personalTasks || [];
                setTasks(data.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()));
            } catch (err: any) {
                toast.error(err.message || 'Không thể tải danh sách công việc');
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const handleTaskCreated = (taskData: TaskPayload) => {
        setTasks((prev) => {
            const exists = prev.some((t) => t.id === taskData.id);
            const updated = exists ? prev.map((t) => (t.id === taskData.id ? taskData : t)) : [...prev, taskData];
            return updated.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
        });
    };

    return (
        <div className="mx-auto p-4">
            <Calendar tasks={tasks} loading={loading} onTaskCreated={handleTaskCreated} />
        </div>
    );
};

export default CalenderPerson;
