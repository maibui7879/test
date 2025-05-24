import apiRequest from '../common/apiRequest';
import { TaskPayload } from '../types/types';

const getAllTaskUser = async (): Promise<TaskPayload> => {
    const res = await apiRequest<TaskPayload>(`/tasks`, 'GET', null, true);
    if (!res.success || !res.data) {
        throw new Error(res.message || 'Không thể lấy task');
    }
    return res.data;
};

export default getAllTaskUser;
