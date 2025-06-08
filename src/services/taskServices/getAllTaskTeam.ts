import apiRequest from '../common/apiRequest';
import { TeamTasksResponse } from '../types/types';

interface TaskQueryParams {
    page?: number;
    limit?: number;
    searchTitle?: string;
    status?: 'todo' | 'in_progress' | 'done';
    priority?: 'low' | 'medium' | 'high';
    startDate?: string;
    endDate?: string;
}

const getAllTaskTeam = async (teamId: string, params?: TaskQueryParams): Promise<TeamTasksResponse> => {
    try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.searchTitle) queryParams.append('searchTitle', params.searchTitle);
        if (params?.status) queryParams.append('status', params.status);
        if (params?.priority) queryParams.append('priority', params.priority);
        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);

        const url = `/tasks/team/${teamId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const res = await apiRequest<TeamTasksResponse>(url, 'GET', null, true);

        if (!res.success) {
            throw new Error(res.message || 'Không thể lấy danh sách công việc của team');
        }

        if (!res.data) {
            return {
                totalItems: 0,
                totalPages: 0,
                currentPage: params?.page || 1,
                pageSize: params?.limit || 10,
                tasksTeam: [],
            };
        }

        return res.data;
    } catch (error: any) {
        console.error('Error fetching team tasks:', error);
        throw new Error(error.message || 'Không thể lấy danh sách công việc của team');
    }
};

export default getAllTaskTeam;
