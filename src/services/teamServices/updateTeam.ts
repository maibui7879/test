import apiRequest, { ApiResponse } from '../common/apiRequest';
import { UpdateTeamPayload, Team } from '../types/types';

const updateTeam = async (teamId: number, payload: UpdateTeamPayload): Promise<ApiResponse<Team>> => {
    try {
        if (!teamId) {
            throw new Error('ID nhóm không hợp lệ');
        }

        const formData = new FormData();

        if (payload.name) {
            formData.append('name', payload.name.trim());
        }
        if (payload.description) {
            formData.append('description', payload.description.trim());
        }

        if (payload.avatar instanceof File) {
            formData.append('avatar', payload.avatar);
        } else if (payload.avatar === null) {
            formData.append('avatar', '');
        }

        const res = await apiRequest<Team>(`/teams/${teamId}`, 'PUT', formData, true);

        if (!res.success) {
            throw new Error(res.message || 'Không thể cập nhật thông tin nhóm');
        }

        return res;
    } catch (error: any) {
        console.error('Error updating team:', error);
        throw new Error(error.message || 'Có lỗi xảy ra khi cập nhật thông tin nhóm');
    }
};

export default updateTeam;
