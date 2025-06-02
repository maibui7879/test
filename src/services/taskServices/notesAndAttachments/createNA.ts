import apiRequest from '../../common/apiRequest';
import { TaskNotesAndAttachments } from '../../types/types';

const createNA = async (taskId: number, data: { note?: string; file?: File }): Promise<TaskNotesAndAttachments> => {
    const formData = new FormData();
    formData.append('taskId', taskId.toString());
    if (data.note) formData.append('note', data.note);
    if (data.file) formData.append('attachment', data.file);

    const res = await apiRequest<TaskNotesAndAttachments>(`/note/notes-attachments`, 'POST', formData, true);
    if (!res.success || !res.data) throw new Error(res.message || 'Không thể tạo ghi chú hoặc tệp đính kèm');
    return res.data;
};

export default createNA;
