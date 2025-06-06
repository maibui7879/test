import apiRequest, { ApiResponse } from '../common/apiRequest';

export interface TeamStatistics {
    total_members: number;
    total_tasks: number;
    in_progress_tasks: number;
    completed_tasks: number;
    todo_tasks: number;
    completion_rate: string;
    total_comments: number;
    assigned_tasks: number;
    high_priority_tasks: number;
    medium_priority_tasks: number;
    low_priority_tasks: number;
    most_active_member: string | null;
    recent_tasks: number;
    in_progress_rate: string;
    todo_rate: string;
    assignment_rate: string;
    avg_comments_per_task: string;
    high_priority_rate: string;
}

const getTeamStatistics = async (teamId: number): Promise<TeamStatistics> => {
    try {
        if (!teamId) {
            throw new Error('ID nhóm không hợp lệ');
        }

        const res = await apiRequest<TeamStatistics>(`/teams/${teamId}/statistics`, 'GET');

        if (!res.success || !res.data) {
            throw new Error(res.message || 'Không thể lấy thống kê nhóm');
        }

        return res.data;
    } catch (error: any) {
        console.error('Error getting team statistics:', error);
        throw new Error(error.message || 'Có lỗi xảy ra khi lấy thống kê nhóm');
    }
};

export default getTeamStatistics;
