import apiRequest from '../common/apiRequest';
import { Reminder } from '../types/types';

const getReminders = async (onlyUnread?: boolean): Promise<Reminder[]> => {
    const query = onlyUnread ? '?onlyUnread=true' : '';
    const res = await apiRequest<Reminder[]>(`/reminders${query}`, 'GET', null, true);

    if (!res.success || !res.data) {
        throw new Error(res.message || 'Không thể lấy danh sách nhắc nhở');
    }

    return res.data;
};

export default getReminders;
