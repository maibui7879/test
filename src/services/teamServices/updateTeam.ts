import apiRequest, { ApiResponse } from '../common/apiRequest';
import { UpdateTeamPayload, Team } from '../types/types';

const updateTeam = async (teamId: number, payload: UpdateTeamPayload): Promise<ApiResponse<Team>> => {
    const formData = new FormData();

    if (payload.name !== undefined) {
        formData.append('name', payload.name);
    }

    if (payload.description !== undefined) {
        formData.append('description', payload.description);
    }

    if (payload.avatar_url && payload.avatar_url instanceof File) {
        formData.append('avatar_url', payload.avatar_url);
    } else if (payload.avatar_url === null) {
        formData.append('avatar_url', '');
    }

    const res = await apiRequest(`/teams/${teamId}`, 'PUT', formData, true);

    if (!res.success) {
        console.error('Error updating team:', res.message);
    }

    return res;
};
export default updateTeam;
