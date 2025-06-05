import apiRequest from '../../common/apiRequest';

const removeMember = async (teamId: number, userId: number): Promise<void> => {
    try {
        const res = await apiRequest(`/teams/member/${teamId}/remove/${userId}`, 'DELETE', null, true);
        if (!res.success) {
            throw new Error(res.message || 'Không thể gỡ thành viên khỏi team');
        }
    } catch (error) {
        console.error('Error removing member:', error);
        throw error; // Throw the original error to handle it in the component
    }
};

export default removeMember;
