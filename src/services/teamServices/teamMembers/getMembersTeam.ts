import apiRequest from '../../common/apiRequest';

export interface TeamMemberInfo {
    id: number;
    full_name: string;
    role: string;
    avatar_url: string;
}

const getMembers = async (teamId: number): Promise<TeamMemberInfo[]> => {
    try {
        const res = await apiRequest<TeamMemberInfo[]>(`/teams/${teamId}/members`, 'GET', null, true);
        if (!res.success || !res.data) {
            throw new Error(res.message || 'Không thể lấy danh sách thành viên');
        }
        return res.data;
    } catch (error) {
        console.error('Error fetching team members:', error);
        throw new Error('Không thể lấy danh sách thành viên');
    }
};

export default getMembers;
