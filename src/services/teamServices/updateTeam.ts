import apiRequest from '../common/apiRequest';
import { UpdateTeamPayload } from '../types/types';

const updateTeam = async (teamId: number, payload: UpdateTeamPayload): Promise<void> => {
    const formData = new FormData();

    if (payload.name !== undefined) {
        formData.append('name', payload.name);
    }

    if (payload.description !== undefined) {
        formData.append('description', payload.description);
    }

    if (payload.avatar_url) {
        formData.append('avatar_url', payload.avatar_url);
    }

    const res = await apiRequest(`/teams/${teamId}`, 'PUT', formData, true);

    if (!res.success) throw new Error(res.message || 'Không thể cập nhật team');
};
export default updateTeam;
