import apiRequest from '../common/apiRequest';
import { Team, TeamListResponse } from '../types/types';

const getTeams = async (): Promise<Team[]> => {
    const res = await apiRequest<TeamListResponse>('/teams', 'GET', null, true);
    if (!res.success || !res.data) throw new Error(res.message || 'Không thể lấy danh sách team');
    return res.data.items;
};
export default getTeams;
