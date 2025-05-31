import apiRequest from '../common/apiRequest';
import { TaskPayload } from '../types/types';

interface TaskResponse {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    personalTasks: TaskPayload[];
}

interface TaskQueryParams {
    page?: number;
    limit?: number;
}

const getAllTaskUser = async (params?: TaskQueryParams): Promise<TaskResponse> => {
    try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const url = `/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const res = await apiRequest<TaskResponse>(url, 'GET', null, true);

        if (!res.success) {
            throw new Error(res.message || 'Không thể lấy danh sách công việc');
        }

        if (!res.data) {
            return {
                totalItems: 0,
                totalPages: 0,
                currentPage: params?.page || 1,
                pageSize: params?.limit || 10,
                personalTasks: [],
            };
        }

        return res.data;
    } catch (error: any) {
        console.error('Error fetching tasks:', error);
        throw new Error(error.message || 'Không thể lấy danh sách công việc');
    }
};

export default getAllTaskUser;
