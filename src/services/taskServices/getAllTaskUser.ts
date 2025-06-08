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
    searchTitle?: string;
    status?: 'todo' | 'in_progress' | 'done';
    priority?: 'low' | 'medium' | 'high';
    startDate?: string;
    endDate?: string;
}

const getAllTaskUser = async (params?: TaskQueryParams): Promise<TaskResponse> => {
    try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.searchTitle) queryParams.append('searchTitle', params.searchTitle);
        if (params?.status) queryParams.append('status', params.status);
        if (params?.priority) queryParams.append('priority', params.priority);
        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);

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
