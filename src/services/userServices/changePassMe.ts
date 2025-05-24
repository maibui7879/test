import apiRequest from '../common/apiRequest';
import { ChangePasswordPayload } from '../types/types';

const changePassMe = async (data: ChangePasswordPayload): Promise<void> => {
    const res = await apiRequest<void>('/user/change-password', 'POST', data, true);
    if (!res.success) {
        throw new Error(res.message || 'Không thể đổi mật khẩu.');
    }
};

export default changePassMe;
