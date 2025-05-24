// api/taskComments/deleteTaskComment.ts
import apiRequest from '../../common/apiRequest';

export const deleteTaskComment = async (commentId: number): Promise<void> => {
    const res = await apiRequest(`/teams/task-comments/${commentId}`, 'DELETE', null, true);
    if (!res.success) throw new Error(res.message || 'Không thể xoá bình luận');
};
