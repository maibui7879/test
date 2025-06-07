import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useMessage } from '@/hooks/useMessage';
import { getToken } from '@/utils/auth/authUtils';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
    const { message, contextHolder } = useMessage();

    useEffect(() => {
        const token = getToken();
        const userRole = localStorage.getItem('role');

        if (!token) {
            message.error({
                key: 'auth',
                content: 'Vui lòng đăng nhập để tiếp tục',
            });
            return;
        }

        if (requireAdmin && userRole !== 'admin') {
            message.warning({
                key: 'admin',
                content: 'Bạn không có quyền truy cập trang này',
            });
        }
    }, [requireAdmin, message]);

    const token = getToken();
    const userRole = localStorage.getItem('role');

    if (!token) {
        return (
            <>
                {contextHolder}
                <Navigate to="/404" replace />
            </>
        );
    }

    if (requireAdmin && userRole !== 'admin') {
        return (
            <>
                {contextHolder}
                <Navigate to="/dashboard" replace />
            </>
        );
    }

    return (
        <>
            {contextHolder}
            {children}
        </>
    );
};

export default ProtectedRoute;
