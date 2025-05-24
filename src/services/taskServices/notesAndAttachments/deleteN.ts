import apiRequest from '../../common/apiRequest';

const deleteTaskNote = async (noteId: number): Promise<void> => {
    const res = await apiRequest(`/note/tasks/notes-attachments/${noteId}`, 'DELETE', null, true);
    if (!res.success) throw new Error(res.message || 'Không thể xoá ghi chú');
};
export default deleteTaskNote;
