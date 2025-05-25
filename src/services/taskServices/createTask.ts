import apiRequest from '../common/apiRequest';
import { TaskPayload } from '../types/types';

const createTask = async (payload: TaskPayload): Promise<void> => {
    // Đảm bảo không có giá trị undefined
    const cleanPayload = {
        title: payload.title,
        description: payload.description || null,
        start_time: payload.start_time,
        end_time: payload.end_time,
        status: payload.status,
        priority: payload.priority,
        team_id: payload.team_id || null
    };

    const res = await apiRequest('/tasks', 'POST', cleanPayload, true);
    if (!res.success) {
        throw new Error(res.message || 'Không thể tạo task');
    }
};

export default createTask;
