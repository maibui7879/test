import apiRequest from '../common/apiRequest';

const deleteTeam = async (teamId: number): Promise<void> => {
    const res = await apiRequest(`/teams/${teamId}`, 'DELETE', null, true);
    if (!res.success) throw new Error(res.message || 'Không thể xoá team');
};
export default deleteTeam;
