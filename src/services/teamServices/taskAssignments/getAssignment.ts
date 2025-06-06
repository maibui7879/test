import apiRequest from '../../common/apiRequest';
import { TaskAssignment } from '../../types/types';

//chưa biết dùng làm gì
const getAssignment = async (teamId: string): Promise<TaskAssignment[]> => {
    const res = await apiRequest<TaskAssignment[]>(`/teams/${teamId}/task/assign`, 'GET', null, true);
    if (!res.success || !res.data) {
        throw new Error(res.message || 'Không thể lấy danh sách phân công công việc');
    }
    return res.data;
};

export default getAssignment;
