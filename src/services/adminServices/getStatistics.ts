import apiRequest from '../common/apiRequest';

export type StatisticsPeriod = 'day' | 'week' | 'month' | 'year';

export interface GetStatisticsParams {
    period: StatisticsPeriod;
}

export interface StatisticsDetail {
    period: number;
    new_users?: number;
    personal_tasks?: number;
    team_tasks?: number;
    new_teams?: number;
}

export interface StatisticsData {
    user_registration: {
        total: number;
        details: StatisticsDetail[];
    };
    tasks: {
        personal: {
            total: number;
            details: StatisticsDetail[];
        };
        team: {
            total: number;
            details: StatisticsDetail[];
        };
    };
    teams: {
        total: number;
        details: StatisticsDetail[];
    };
}

export interface GetStatisticsResponse {
    period: StatisticsPeriod;
    statistics: StatisticsData;
}

const getStatisticsApi = async (params: GetStatisticsParams): Promise<GetStatisticsResponse> => {
    console.log('getStatistics service called with params:', params);
    const { period } = params;

    try {
        const response = await apiRequest<GetStatisticsResponse>(
            `/statistics/admin?period=${period}`,
            'GET',
            null,
            true,
        );
        console.log('API response in service:', response);

        if (!response.success || !response.data) {
            throw new Error(response.message || 'Không thể lấy thống kê');
        }

        return response.data;
    } catch (error) {
        console.error('Error in getStatistics service:', error);
        throw error;
    }
};

export default getStatisticsApi;
