import apiRequest from '../common/apiRequest';
import type { UserLog } from '../types/types';
import type { ApiResponse } from '../common/apiRequest';

export interface GetUserLogsParams {
    page?: string;
    limit?: string;
    startDate?: string;
    endDate?: string;
    action?: string;
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface GetUserLogsResponse {
    logs: UserLog[];
}

const getUserLogsApi = async (params: GetUserLogsParams = {}): Promise<ApiResponse<GetUserLogsResponse>> => {
    console.log('getUserLogs service called with params:', params);
    const { page = '1', limit = '10', startDate, endDate, action } = params;

    try {
        const queryParams = new URLSearchParams({
            page,
            limit,
        });

        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);
        if (action) queryParams.append('action', action);

        const response = await apiRequest<GetUserLogsResponse>(
            `/admin/logs?${queryParams.toString()}`,
            'GET',
            null,
            true,
        );
        console.log('API response in service:', response);

        if (!response.success || !response.data) {
            throw new Error(response.message || 'Không thể lấy lịch sử hoạt động');
        }

        return response;
    } catch (error) {
        console.error('Error in getUserLogs service:', error);
        throw error;
    }
};

export default getUserLogsApi;
