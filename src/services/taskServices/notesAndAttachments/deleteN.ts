import apiRequest from '../../common/apiRequest';

const deleteN = async (noteId: number): Promise<void> => {
    const res = await apiRequest(`/note/notes-attachments/${noteId}`, 'DELETE', null, true);
    if (!res.success) throw new Error(res.message || 'Không thể xóa ghi chú');
};

export default deleteN;
