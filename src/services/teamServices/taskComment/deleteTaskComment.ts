import apiRequest from '../../common/apiRequest';

const deleteTaskComment = async (commentId: number): Promise<void> => {
    const res = await apiRequest(`/teams/task-comments/${commentId}`, 'DELETE', null, true);
    if (!res.success) throw new Error(res.message || 'Không thể xoá bình luận');
};
export default deleteTaskComment;
