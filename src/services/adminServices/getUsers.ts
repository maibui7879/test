import apiRequest from '../common/apiRequest';
import type { GetUsersResponse, GetUsersParams } from '../types/types';

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface GetUsersResponseData {
    data: GetUsersResponse;
    pagination: PaginationInfo;
}

const getUsersApi = async (params: GetUsersParams = {}): Promise<GetUsersResponseData> => {
    console.log('getUsers service called with params:', params);
    const { page = '1', limit = '10', gender } = params;

    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (gender) queryParams.append('gender', gender);

        const response = await apiRequest<GetUsersResponseData>(
            `/admin/users?${queryParams.toString()}`,
            'GET',
            null,
            true,
        );
        console.log('API response in service:', response);

        if (!response.success || !response.data) {
            throw new Error(response.message || 'Không thể lấy danh sách người dùng');
        }

        return response.data;
    } catch (error) {
        console.error('Error in getUsers service:', error);
        throw error;
    }
};

export default getUsersApi;
