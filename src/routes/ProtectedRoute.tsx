import React, { useEffect } from 'react';
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

    if (!user || (requireAdmin && user.role !== 'admin')) {
        return <>{contextHolder}</>;
    }

    return (
        <>
            {contextHolder}
            {children}
        </>
    );
};

export default ProtectedRoute;
