import apiRequest from '../common/apiRequest';
import { UserProfile } from '../types/types';

const getProfileOtherUserByNameEmail = async (id: string): Promise<UserProfile> => {
    const res = await apiRequest<UserProfile>(`/user/profile/${id}`, 'GET', null, true);
    if (!res.success || !res.data) {
        throw new Error(res.message || 'Không thể lấy thông tin người dùng.');
    }
    return res.data;
};

export default getProfileOtherUserByNameEmail;
