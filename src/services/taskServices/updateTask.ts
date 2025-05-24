import apiRequest from '../common/apiRequest';
import { TaskPayload } from '../types/types';

const updateTask = async (id: number, payload: TaskPayload): Promise<void> => {
    const res = await apiRequest(`/tasks/${id}`, 'PUT', payload, true);
    if (!res.success) {
        throw new Error(res.message || 'Không thể cập nhật task');
    }
};
export default updateTask;
