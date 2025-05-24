import apiRequest from '../../common/apiRequest';

const createTaskComment = async (taskId: number, comment: string): Promise<void> => {
    const res = await apiRequest('/teams/task-comments', 'POST', { taskId, comment }, true);
    if (!res.success) throw new Error(res.message || 'Không thể tạo bình luận');
};
export default createTaskComment;
