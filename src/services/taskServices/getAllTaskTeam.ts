import apiRequest from '../common/apiRequest';
import { TeamTasksResponse } from '../types/types';

interface TaskQueryParams {
    page?: number;
    limit?: number;
}

const getAllTaskTeam = async (teamId: string, params?: TaskQueryParams): Promise<TeamTasksResponse> => {
    try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

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
