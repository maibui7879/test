import apiRequest from '../common/apiRequest';

const register = async (email: string, password: string, full_name: string): Promise<string> => {
    const res = await apiRequest<void>('/auth/register', 'POST', { email, password, full_name }, false);

    if (!res.success) {
        throw new Error(res.message || 'Đăng ký thất bại.');
    }

    return res.message || 'Đăng ký thành công.';
};

export default register;
