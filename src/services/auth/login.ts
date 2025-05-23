import apiRequest from '../common/apiRequest';

interface LoginResponse {
    accessToken: string;
    user?: {
        id: string;
        email: string;
        name?: string;
        role?: string;
    };
}

const login = async (email: string, password: string) => {
    return await apiRequest<LoginResponse>('/auth/login', 'POST', { email, password }, false);
};

export default login;
