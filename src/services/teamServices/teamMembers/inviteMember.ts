import apiRequest from '../../common/apiRequest';

const inviteMember = async (teamId: number, userId: number): Promise<void> => {
    const res = await apiRequest(`/teams/member/${teamId}/invite/${userId}`, 'POST', null, true);
    if (!res.success) throw new Error(res.message || 'Không thể mời thành viên vào team');
};

export default inviteMember;
