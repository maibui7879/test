import apiRequest from '../common/apiRequest';
import { Reminder } from '../types/types';

export interface GetRemindersParams {
    is_read: string; // "0" = chưa đọc, "1" = đã đọc
    type?: string; // Loại nhắc nhở (nếu có)
    page?: string;
    limit?: string;
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ReminderResponse {
    data: Reminder[];
    pagination: PaginationInfo;
}

const getReminders = async (params: GetRemindersParams): Promise<ReminderResponse> => {
    console.log('getReminders service called with params:', params);
    const { is_read, type, page = '1', limit = '10' } = params;

    try {
        // Build query string
        const queryParams = new URLSearchParams({
            is_read,
            page,
            limit,
        });

        if (type) {
            queryParams.append('type', type);
        }

        const response = await apiRequest<ReminderResponse>(`/reminders?${queryParams.toString()}`, 'GET', null, true);
        console.log('API response in service:', response);

        if (!response.success || !response.data) {
            throw new Error(response.message || 'Không thể lấy danh sách nhắc nhở');
        }

        return response.data;
    } catch (error) {
        console.error('Error in getReminders service:', error);
        throw error;
    }
};

export default getReminders;
