import apiRequest from '../common/apiRequest';
import { TaskPayload } from '../types/types';

const createTask = async (payload: TaskPayload): Promise<void> => {
    const res = await apiRequest('/tasks', 'POST', payload, true);
    if (!res.success) {
        throw new Error(res.message || 'Không thể tạo task');
    }
};
export default createTask;
