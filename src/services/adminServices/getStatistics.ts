import apiRequest from '../common/apiRequest';

export type StatisticsPeriod = 'month' | 'year' | 'all';

export interface GetStatisticsParams {
    period?: StatisticsPeriod;
}

export interface MonthlyData {
    month: string;
    new_users?: number;
    tasks?: number;
    completed?: string | number;
}

export interface TaskTotal {
    tasks: number;
    completed: string;
}

export interface StatisticsData {
    users: {
        total: number;
        monthly: MonthlyData[];
    };
    tasks: {
        personal: {
            total: TaskTotal;
            monthly: MonthlyData[];
        };
        team: {
            total: TaskTotal;
            monthly: MonthlyData[];
        };
    };
    completed_tasks: {
        total: number;
        monthly: MonthlyData[];
    };
}

export interface GetStatisticsResponse {
    period: StatisticsPeriod;
    statistics: {
        users: {
            total: number;
            monthly: Array<{
                month: string;
                new_users: number;
            }>;
        };
        tasks: {
            personal: {
                total: {
                    tasks: number;
                    completed: string;
                };
                monthly: Array<{
                    month: string;
                    tasks: number;
                    completed: string;
                }>;
            };
            team: {
                total: {
                    tasks: number;
                    completed: string;
                };
                monthly: Array<{
                    month: string;
                    tasks: number;
                    completed: string;
                }>;
            };
        };
        completed_tasks: {
            total: number;
            monthly: Array<{
                month: string;
                completed: number;
            }>;
        };
    };
}

const getStatisticsApi = async (params?: GetStatisticsParams): Promise<GetStatisticsResponse> => {
    const url =
        params?.period && params.period !== 'all' ? `/statistics/admin?period=${params.period}` : '/statistics/admin';
    const response = await apiRequest<GetStatisticsResponse>(url, 'GET', null, true);
    if (!response.success || !response.data) {
        throw new Error(response.message || 'Không thể lấy thống kê');
    }
    return response.data;
};
export default getStatisticsApi;
