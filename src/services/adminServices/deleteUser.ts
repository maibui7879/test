import apiRequest from '../common/apiRequest';

export interface DeleteUserParams {
    userId: string;
}

export interface DeleteUserResponse {
    success: boolean;
    message: string;
    data: {
        id: number;
        deleted: boolean;
    };
}

const deleteUserApi = async (params: DeleteUserParams): Promise<DeleteUserResponse> => {
    console.log('deleteUser service called with params:', params);
    const { userId } = params;

    try {
        const response = await apiRequest<DeleteUserResponse>(`/admin/users/`, 'DELETE', { userId }, true);
        console.log('API response in service:', response);

        if (!response.success || !response.data) {
            throw new Error(response.message || 'Không thể xóa người dùng');
        }

        return response.data;
    } catch (error) {
        console.error('Error in deleteUser service:', error);
        throw error;
    }
};

export default deleteUserApi;
