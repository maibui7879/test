import apiRequest from '../../common/apiRequest';

const deleteTaskAttachment = async (attachmentId: number): Promise<void> => {
    const res = await apiRequest(`/note/tasks/notes-attachments/attachments/${attachmentId}`, 'DELETE', null, true);
    if (!res.success) throw new Error(res.message || 'Không thể xoá ghi chú');
};
export default deleteTaskAttachment;
