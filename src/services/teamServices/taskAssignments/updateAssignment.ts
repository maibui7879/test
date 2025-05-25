import apiRequest from '../../common/apiRequest';
import { UpdateAssignmentPayload } from '../../types/types';

const updateAssignment = async (data: UpdateAssignmentPayload): Promise<void> => {
    const res = await apiRequest(`/teams/task/assign`, 'PATCH', data, true);
    if (!res.success) {
        throw new Error(res.message || 'Không thể cập nhật phân công');
    }
};

export default updateAssignment;
