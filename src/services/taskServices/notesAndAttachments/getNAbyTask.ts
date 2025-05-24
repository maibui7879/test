import apiRequest from '../../common/apiRequest';
import { TaskNotesAndAttachments } from '../../types/types';

export const getTaskNotesByTaskId = async (taskId: number): Promise<TaskNotesAndAttachments[]> => {
    const res = await apiRequest<TaskNotesAndAttachments[]>(
        `/note/tasks/notes-attachments/${taskId}`,
        'GET',
        null,
        true,
    );
    if (!res.success || !res.data) throw new Error(res.message || 'Không thể lấy ghi chú');
    return res.data;
};
