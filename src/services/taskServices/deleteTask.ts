import apiRequest from '../common/apiRequest';

const deleteTask = async (id: number): Promise<void> => {
    const res = await apiRequest(`/tasks/${id}`, 'DELETE', null, true);
    if (!res.success) {
        throw new Error(res.message || 'Không thể xoá task');
    }
};
export default deleteTask;
