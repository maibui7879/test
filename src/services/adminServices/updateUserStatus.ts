import apiRequest from '../common/apiRequest';

export interface UpdateUserStatusParams {
    userId: string;
    status: 'active' | 'inactive';
}

export interface UpdateUserStatusResponse {
    success: boolean;
    message: string;
    data: {
        id: number;
        status: string;
    };
}

const updateUserStatusApi = async (params: UpdateUserStatusParams): Promise<UpdateUserStatusResponse> => {
    console.log('updateUserStatus service called with params:', params);
    const { userId, status } = params;

    try {
        const response = await apiRequest<UpdateUserStatusResponse>(
            `/admin/users/${userId}/status`,
            'PUT',
            { status },
            true,
        );
        console.log('API response in service:', response);

        if (!response.success || !response.data) {
            throw new Error(response.message || 'Không thể cập nhật trạng thái người dùng');
        }

        return response.data;
    } catch (error) {
        console.error('Error in updateUserStatus service:', error);
        throw error;
    }
};

export default updateUserStatusApi;
