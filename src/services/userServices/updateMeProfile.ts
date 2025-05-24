import apiRequest from '../common/apiRequest';
import { UserProfile } from '../types/types';

const updateMeProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const res = await apiRequest<UserProfile>('/user/profile', 'PUT', data, true);
    if (!res.success || !res.data) {
        throw new Error(res.message || 'Không thể cập nhật thông tin người dùng.');
    }
    return res.data;
};

export default updateMeProfile;
