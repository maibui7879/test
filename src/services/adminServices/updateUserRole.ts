import apiRequest from '../common/apiRequest';

export interface UpdateUserRoleParams {
    userId: string;
    role: 'admin' | 'member';
}

export interface UpdateUserRoleResponse {
    success: boolean;
    message: string;
    data: {
        id: number;
        role: string;
    };
}

const updateUserRoleApi = async (params: UpdateUserRoleParams): Promise<UpdateUserRoleResponse> => {
    console.log('updateUserRole service called with params:', params);
    const { userId, role } = params;

    try {
        const response = await apiRequest<UpdateUserRoleResponse>(`/admin/users/${userId}/role`, 'PUT', { role }, true);
        console.log('API response in service:', response);

        if (!response.success || !response.data) {
            throw new Error(response.message || 'Không thể cập nhật vai trò người dùng');
        }

        return response.data;
    } catch (error) {
        console.error('Error in updateUserRole service:', error);
        throw error;
    }
};

export default updateUserRoleApi;
