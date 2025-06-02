import apiRequest from '../../common/apiRequest';
import { TaskNotesAndAttachments } from '../../types/types';

const updateNA = async (noteId: number, content: string): Promise<TaskNotesAndAttachments> => {
    const res = await apiRequest<TaskNotesAndAttachments>(
        `/note/notes-attachments/${noteId}`,
        'PUT',
        { content },
        true,
    );
    if (!res.success || !res.data) throw new Error(res.message || 'Không thể cập nhật ghi chú');
    return res.data;
};

export default updateNA;
