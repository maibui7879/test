import apiRequest from '../common/apiRequest';
import type { UserLog } from '../types/types';

export interface GetUserLogsParams {
    page?: string;
    limit?: string;
    fullName?: string;
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface UserLogsData {
    logs: UserLog[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface GetUserLogsResponse {
    success: boolean;
    data: UserLogsData;
}

const getUserLogsApi = async (params: GetUserLogsParams = {}): Promise<UserLogsData> => {
    const { page = '1', limit = '10', fullName } = params;

    try {
        const queryParams = new URLSearchParams({
            page,
            limit,
        });

        if (fullName) queryParams.append('fullName', fullName);

        const response = await apiRequest<GetUserLogsResponse>(
            `/admin/logs?${queryParams.toString()}`,
            'GET',
            null,
            true,
        );

        if (!response.success) {
            throw new Error(response.message || 'Không thể lấy lịch sử hoạt động');
        }

        if (!response.data?.data) {
            throw new Error('Dữ liệu trả về không hợp lệ');
        }

        return response.data.data;
    } catch (error) {
        console.error('Error in getUserLogs service:', error);
        throw error;
    }
};

export default getUserLogsApi;
