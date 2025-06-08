import apiRequest from '../common/apiRequest';

export interface AdminLog {
    id: number;
    admin_id: number;
    action_type: string;
    action: string;
    description: string;
    target_type: string;
    target_id: number | null;
    old_data: any;
    new_data: any;
    ip_address: string;
    created_at: string;
    admin_email: string;
    admin_name: string;
}

export interface GetAdminLogsParams {
    page?: string;
    limit?: string;
    actionType?: string;
    startDate?: string;
    endDate?: string;
}

export interface AdminLogsData {
    logs: AdminLog[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface GetAdminLogsResponse {
    success: boolean;
    data: AdminLogsData;
}

const getAdminLogsApi = async (params: GetAdminLogsParams = {}): Promise<AdminLogsData> => {
    try {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.actionType) queryParams.append('actionType', params.actionType);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);

        const response = await apiRequest<GetAdminLogsResponse>(
            `/admin/admin-logs?${queryParams.toString()}`,
            'GET',
            null,
            true,
        );

        if (!response.success || !response.data?.data) {
            throw new Error(response.message || 'Không thể lấy danh sách log');
        }

        return response.data.data;
    } catch (error) {
        console.error('Error in getAdminLogs service:', error);
        throw error;
    }
};

export default getAdminLogsApi;
