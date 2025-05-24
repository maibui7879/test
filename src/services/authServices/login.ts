import apiRequest from '../common/apiRequest';
import { LoginResponse } from '../types/types';

const loginApi = async (email: string, password: string) => {
    return await apiRequest<LoginResponse>('/auth/login', 'POST', { email, password }, false);
};

export default loginApi;
