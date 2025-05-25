import apiRequest from '../../common/apiRequest';

const changeRoleMember = async (teamId: number, userId: number): Promise<void> => {
    const res = await apiRequest(`/teams/member/${teamId}/change-role/${userId}`, 'PUT', null, true);

    if (!res.success) {
        throw new Error(res.message || 'Không thể thay đổi vai trò của thành viên trong team');
    }
};

export default changeRoleMember;
