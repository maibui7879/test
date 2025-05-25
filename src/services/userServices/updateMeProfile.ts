import apiRequest from '../common/apiRequest';
import { UserProfile } from '../types/types';

const updateMeProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            if (key === 'avatar_url' && value instanceof File) {
                formData.append('avatar_url', value);
            } else {
                formData.append(key, String(value));
            }
        }
    });

    const res = await apiRequest<UserProfile>('/user/profile', 'PUT', formData, true);

    if (!res.success || !res.data) {
        throw new Error(res.message || 'Không thể cập nhật thông tin người dùng.');
    }
    return res.data;
};

export default updateMeProfile;
