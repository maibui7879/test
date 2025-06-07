import apiRequest from '../common/apiRequest';
import type { CreateUserParams, CreateUserResponse } from '../types/types';

export interface CreateUserResponseData {
    success: boolean;
    message: string;
    data: CreateUserResponse;
}

const createUserApi = async (params: CreateUserParams): Promise<CreateUserResponseData> => {
    console.log('createUser service called with params:', params);

    try {
        const response = await apiRequest<CreateUserResponseData>('/admin/users', 'POST', params, true);
        console.log('API response in service:', response);

        if (!response.success || !response.data) {
            throw new Error(response.message || 'Không thể tạo người dùng');
        }

        return response.data;
    } catch (error) {
        console.error('Error in createUser service:', error);
        throw error;
    }
};

export default createUserApi;
