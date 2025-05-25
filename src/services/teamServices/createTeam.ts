import apiRequest from '../common/apiRequest';
import { CreateTeamPayload } from '../types/types';

const createTeam = async (payload: CreateTeamPayload): Promise<void> => {
    const res = await apiRequest('/teams', 'POST', payload, true);
    if (!res.success) throw new Error(res.message || 'Không thể tạo team');
};

export default createTeam;
