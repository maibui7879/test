import apiRequest from '../../common/apiRequest';
import { TaskNotesAndAttachments } from '../../types/types';

const getNAbyTask = async (taskId: number): Promise<TaskNotesAndAttachments[]> => {
    try {
        const res = await apiRequest<TaskNotesAndAttachments[]>(
            `/note/notes-attachments/task/${taskId}`,
            'GET',
            null,
            true,
        );

        if (!res.success) {
            throw new Error(res.message || 'Không thể lấy ghi chú và tệp đính kèm');
        }

        if (!res.data) {
            return [];
        }

        return res.data;
    } catch (error) {
        console.error('Error fetching notes and attachments:', error);
        return [];
    }
};

export default getNAbyTask;
