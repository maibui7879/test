import apiRequest from '../../common/apiRequest';
import { TaskComment } from '../../types/types';

const getTaskComments = async (taskId: number): Promise<TaskComment[]> => {
    const res = await apiRequest<{ comments: TaskComment[] }>(`/teams/task-comments/task/${taskId}`, 'GET', null, true);
    if (!res.success || !res.data) throw new Error(res.message || 'Không thể lấy bình luận');

    return res.data.comments || [];
};

export default getTaskComments;
