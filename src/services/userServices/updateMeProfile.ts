import apiRequest from '../common/apiRequest';
import { UpdateUserProfile, UserProfile } from '../types/types';

const updateMeProfile = async (data: Partial<UpdateUserProfile>): Promise<UserProfile> => {
    const formData = new FormData();
    console.log(formData);

    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
            return;
        }

        if (key === 'avatar') {
            if (value instanceof File) {
                if (!value.type.startsWith('image/')) {
                    throw new Error('Invalid file type. Only images are allowed.');
                }
                if (value.size > 3 * 1024 * 1024) {
                    throw new Error('File size too large. Maximum size is 3MB.');
                }
                formData.append('avatar', value);
            }
            return;
        }

        if (key === 'date_of_birth' && value instanceof Date) {
            formData.append(key, value.toISOString().split('T')[0]);
            return;
        }

        formData.append(key, String(value));
    });

    try {
        const res = await apiRequest<UserProfile>('/user/profile', 'PUT', formData, true);

        if (!res.success || !res.data) {
            throw new Error(res.message || 'Failed to update user profile.');
        }

        return res.data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Profile update failed: ${error.message}`);
        }
        throw new Error('An unexpected error occurred while updating profile.');
    }
};

export default updateMeProfile;
