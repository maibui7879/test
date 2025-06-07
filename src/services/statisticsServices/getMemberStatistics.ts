import { StatisticsResponse } from '@services/types/types';
import apiRequest from '../common/apiRequest';

const getMemberStatistics = async (period?: string): Promise<StatisticsResponse> => {
    try {
        const response = await apiRequest(`/statistics/member${period ? `?period=${period}` : ''}`);
        if (!response.success) {
            throw new Error(response.message || 'Failed to fetch statistics');
        }
        return response.data.data;
    } catch (error) {
        console.error('Error fetching member statistics:', error);
        throw error;
    }
};
export default getMemberStatistics;
