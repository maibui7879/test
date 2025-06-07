import { ACCESS_TOKEN_KEY } from '@common/constant';

export const saveToken = (token: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getToken = (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const clearToken = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
};
