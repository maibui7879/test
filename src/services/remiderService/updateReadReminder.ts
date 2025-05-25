import apiRequest from '../common/apiRequest';

const markReminderRead = async (id: number): Promise<void> => {
    const res = await apiRequest(`/reminders/${id}/read`, 'PATCH', null, true);

    if (!res.success) {
        throw new Error(res.message || 'Không thể đánh dấu reminder là đã đọc');
    }
};

export default markReminderRead;
