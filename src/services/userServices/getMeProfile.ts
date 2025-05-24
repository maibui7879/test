import apiRequest from '../common/apiRequest';
import { UserProfile } from '../types/types';

const getMeProfile = async (): Promise<UserProfile> => {
    const res = await apiRequest<UserProfile>('/user/profile', 'GET', null, true);
    if (!res.success || !res.data) {
        throw new Error(res.message || 'Không thể lấy thông tin người dùng.');
    }
    return res.data;
};

export default getMeProfile;
