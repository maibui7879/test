import apiRequest from '../../common/apiRequest';

export const updateTaskComment = async (commentId: number, comment: string): Promise<void> => {
    const res = await apiRequest(`/teams/task-comments/${commentId}`, 'PATCH', { comment }, true);
    if (!res.success) throw new Error(res.message || 'Không thể cập nhật bình luận');
};
