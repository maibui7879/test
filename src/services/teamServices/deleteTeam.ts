import apiRequest from '../common/apiRequest';

interface DeleteTeamResponse {
    success: boolean;
    message?: string;
}

const deleteTeam = async (teamId: number): Promise<void> => {
    try {
        const res = await apiRequest<DeleteTeamResponse>(`/teams/${teamId}`, 'DELETE', null, true);

        if (!res.success) {
            throw new Error(res.message || 'Không thể xóa nhóm');
        }
    } catch (error: any) {
        console.error('Error deleting team:', error);
        throw new Error(error.message || 'Có lỗi xảy ra khi xóa nhóm');
    }
};

export default deleteTeam;
