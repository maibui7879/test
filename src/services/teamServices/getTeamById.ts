import apiRequest from '../common/apiRequest';
import { Team } from '../types/types';

const getTeamById = async (teamId: string): Promise<Team> => {
    const res = await apiRequest<Team>(`/teams/${teamId}`, 'GET', null, true);
    if (!res.success || !res.data) throw new Error(res.message || 'Không thể lấy danh sách team');
    return res.data;
};
export default getTeamById;
