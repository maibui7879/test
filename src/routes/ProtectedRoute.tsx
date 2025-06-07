import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@contexts/useAuth/userContext';
import { useMessage } from '@/hooks/useMessage';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
    const { user } = useUser();
    const { message, contextHolder } = useMessage();

    useEffect(() => {
        if (!user) {
            message.error({
                key: 'auth',
                content: 'Vui lòng đăng nhập để tiếp tục',
            });
            return;
        }

        if (requireAdmin && user.role !== 'admin') {
            message.warning({
                key: 'admin',
                content: 'Bạn không có quyền truy cập trang này',
            });
        }
    }, [user, requireAdmin, message]);

    if (!user) {
        return (
            <>
                {contextHolder}
                <Navigate to="/404" replace />
            </>
        );
    }

    if (requireAdmin && user.role !== 'admin') {
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
