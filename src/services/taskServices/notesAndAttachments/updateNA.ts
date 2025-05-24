import apiRequest from '../../common/apiRequest';
//Tạm chưa dùng đang sai về mặt logic BE
const updateTaskNote = async (noteId: number, note: string, attachment?: File): Promise<void> => {
    const formData = new FormData();
    formData.append('note', note);
    if (attachment) {
        formData.append('attachment', attachment);
    }
    const res = await apiRequest(`/task-notes/${noteId}`, 'PUT', formData, true);

    if (!res.success) {
        throw new Error(res.message || 'Không thể cập nhật ghi chú');
    }
};

export default updateTaskNote;
