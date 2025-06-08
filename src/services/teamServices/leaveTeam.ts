import apiRequest, { ApiResponse } from '../common/apiRequest';

const leaveTeam = async (teamId: number): Promise<ApiResponse<any>> => {
    const res = await apiRequest<any>(`/teams/${teamId}/leave`, 'POST', null, true);
    if (!res.success) {
        throw new Error(res.message || 'Không thể rời khỏi team');
    }
    return res;
};

export default leaveTeam;
