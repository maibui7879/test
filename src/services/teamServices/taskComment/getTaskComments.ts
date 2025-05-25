import apiRequest from '../../common/apiRequest';
import { TaskComment } from '../../types/types';

export const getTaskCommentsByTaskId = async (taskId: number): Promise<TaskComment[]> => {
    const res = await apiRequest<TaskComment[]>(`/teams/task-comments/task/${taskId}`, 'GET', null, true);
    if (!res.success || !res.data) throw new Error(res.message || 'Không thể lấy bình luận');
    return res.data;
};
