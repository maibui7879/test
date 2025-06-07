import { MemberStatistics } from '@services/types/types';
import apiRequest, { ApiResponse } from '../common/apiRequest';

const getMemberStatistics = async (teamId: number, userId: number): Promise<ApiResponse<MemberStatistics>> => {
    const res = await apiRequest<MemberStatistics>(`/teams/${teamId}/members/${userId}/stats`, 'GET', null, true);
    if (!res.success) {
        throw new Error(res.message || 'Không thể lấy thống kê thành viên');
    }
    return res;
};

export default getMemberStatistics;
