import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllTaskTeam } from '@services/taskServices';
import { TaskPayload } from '@services/types/types';
import Calendar from '@components/Calendar';

interface TeamCalendarProps {
    teamId: string | undefined;
}

const TeamCalendar = ({ teamId }: TeamCalendarProps) => {
    const [tasks, setTasks] = useState<TaskPayload[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            if (!teamId) return;

            try {
                setLoading(true);
                const response = await getAllTaskTeam(teamId, { page: 1, limit: 1000000 });
                const data = response?.tasksTeam || [];
                setTasks(
                    data.sort(
                        (a: TaskPayload, b: TaskPayload) =>
                            new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
                    ),
                );
            } catch (err: any) {
                toast.error(err.message || 'Không thể tải danh sách công việc');
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, [teamId]);

    const handleTaskCreated = (taskData: TaskPayload) => {
        setTasks((prev) => {
            const exists = prev.some((t) => t.id === taskData.id);
            const updated = exists ? prev.map((t) => (t.id === taskData.id ? taskData : t)) : [...prev, taskData];
            return updated.sort(
                (a: TaskPayload, b: TaskPayload) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
            );
        });
    };

    if (!teamId) {
        return <div>Không tìm thấy thông tin team</div>;
    }

    return (
        <div className="mx-auto p-0 md:p-4">
            <Calendar tasks={tasks} loading={loading} onTaskCreated={handleTaskCreated} />
        </div>
    );
};

export default TeamCalendar;
