import apiRequest from '../common/apiRequest';

const markReminderRead = async (id: number): Promise<void> => {
    console.log('Marking reminder as read, ID:', id);
    try {
        const res = await apiRequest(`/reminders/${id}/read`, 'PATCH', null, true);
        console.log('Mark as read response:', res);

        if (!res.success) {
            throw new Error(res.message || 'Không thể đánh dấu reminder là đã đọc');
        }
    } catch (error) {
        console.error('Error marking reminder as read:', error);
        throw error;
    }
};

export default markReminderRead;
