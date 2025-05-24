import apiRequest from '../../common/apiRequest';

const createTaskNote = async (taskId: number, note: string, attachment?: File): Promise<void> => {
    const formData = new FormData();
    formData.append('taskId', taskId.toString());
    formData.append('note', note);
    if (attachment) formData.append('attachment', attachment);

    const res = await apiRequest('/task-notes', 'POST', formData, true);

    if (!res.success) throw new Error(res.message || 'Không thể tạo ghi chú');
};
export default createTaskNote;
