import apiRequest from '../../common/apiRequest';

const removeMember = async (teamId: number, userId: number): Promise<void> => {
    const res = await apiRequest(`/teams/member/${teamId}/remove/${userId}`, 'DELETE', null, true);

    if (!res.success) {
        throw new Error(res.message || 'Không thể gỡ thành viên khỏi team');
    }
};

export default removeMember;
