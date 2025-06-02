import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getMeProfile } from '../../services/userServices';
import loginApi from '../../services/authServices/login';
import { UserProfile } from '../../services/types/types';
import { clearToken, getToken, saveToken } from '../../utils/auth/authUtils';

interface UserContextType {
    user: UserProfile | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    fetchUserInfo: () => Promise<void>;
    isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(getToken());
    const [user, setUser] = useState<UserProfile | null>(null);

    const logout = useCallback(() => {
        clearToken();
        setToken(null);
        setUser(null);
    }, []);

    const fetchUserInfo = useCallback(async () => {
        if (!token) return;
        try {
            const userInfo = await getMeProfile();
            setUser(userInfo);
        } catch (error) {
            console.error('Lỗi khi lấy user info:', error);
            logout();
        }
    }, [token, logout]);

    const login = async (email: string, password: string) => {
        try {
            const res = await loginApi(email, password);
            const receivedToken = res.data?.token;
            if (!receivedToken) throw new Error('Token không tồn tại');
            saveToken(receivedToken);
            setToken(receivedToken);

            const userInfo = await getMeProfile();

            const allowedRoles = ['admin', 'member'];
            if (!allowedRoles.includes(userInfo.role)) {
                logout();
                throw new Error('Bạn không có quyền truy cập');
            }

            setUser(userInfo);
        } catch (error) {
            logout();
            throw error;
        }
    };

    useEffect(() => {
        if (token) fetchUserInfo();
    }, [token, fetchUserInfo]);

    return (
        <UserContext.Provider value={{ user, token, login, logout, fetchUserInfo, isAuthenticated: !!user && !!token }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser phải dùng trong UserProvider');
    return context;
};
