import apiRequest from '../../common/apiRequest';

export interface TeamMemberInfo {
    id: number;
    full_name: string;
    role: string;
}

const getMembers = async (teamId: number): Promise<TeamMemberInfo[]> => {
    const res = await apiRequest<TeamMemberInfo[]>(`/teams/${teamId}/members`, 'GET', null, true);
    if (!res.success || !res.data) throw new Error(res.message || 'Không thể lấy thành viên trong team');
    return res.data;
};

export default getMembers;
