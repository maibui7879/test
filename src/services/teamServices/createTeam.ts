import apiRequest from '../common/apiRequest';
import { CreateTeamPayload } from '../types/types';

const createTeam = async (payload: CreateTeamPayload): Promise<any> => {
    const res = await apiRequest('/teams', 'POST', payload, true);
    if (!res.success) {
        // Depending on desired error handling, you might still throw here
        // throw new Error(res.message || 'Không thể tạo team');
        console.error(res.message || 'Không thể tạo team');
    }
    return res; // Return the full response object
};

export default createTeam;
