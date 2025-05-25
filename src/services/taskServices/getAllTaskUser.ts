import apiRequest from '../common/apiRequest';
import { TaskPayload } from '../types/types';

interface TaskResponse {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    personalTasks: TaskPayload[];
}

const getAllTaskUser = async (): Promise<TaskResponse> => {
    try {
        const res = await apiRequest<TaskResponse>(`/tasks`, 'GET', null, true);
        if (!res.success) {
            throw new Error(res.message || 'Không thể lấy task');
        }
        
        if (!res.data) {
            return {
                totalItems: 0,
                totalPages: 0,
                currentPage: 1,
                pageSize: 10,
                personalTasks: []
            };
        }

        return res.data;
    } catch (error: any) {
        console.error('Error fetching tasks:', error);
        throw new Error(error.message || 'Không thể lấy danh sách công việc');
    }
};

export default getAllTaskUser;
