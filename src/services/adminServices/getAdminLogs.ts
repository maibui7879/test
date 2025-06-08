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
    page?: number;
    limit?: number;
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
        const response = await apiRequest<GetAdminLogsResponse>('/admin/admin-logs', 'GET', params, true);
        if (!response.data?.data) {
            throw new Error('Không thể lấy danh sách log');
        }
        return response.data.data;
    } catch (error) {
        console.error('Error in getAdminLogs service:', error);
        throw error;
    }
};

export default getAdminLogsApi;
