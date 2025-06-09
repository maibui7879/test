import React, { useCallback, useState, useEffect } from 'react';
import { Layout, Modal, Button, Space } from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DefaultLayoutProps from './type';
import Sidebar from './Sidebar';
import { sidebarRoutes, adminSidebarRoutes } from '@/routes';
import { useUser } from '@contexts/useAuth/userContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMessage } from '@/hooks/useMessage';

const { Content } = Layout;

const DefaultLayout = React.memo(({ children }: DefaultLayoutProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout: originalLogout } = useUser();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'admin' | 'member' | null>(() => {
        return localStorage.getItem('selectedRole') as 'admin' | 'member' | null;
    });
    const navigate = useNavigate();
    const location = useLocation();
    const { message, contextHolder } = useMessage();

    const handleCollapse = useCallback(() => {
        setCollapsed((prev) => !prev);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setCollapsed(true);
            } else {
                setCollapsed(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!user) return; // No user, no action needed

        // Check if this is the first login (e.g., no role selected and just logged in)
        const isFirstLogin = !localStorage.getItem('selectedRole') && user.role === 'admin';

        if (user.role === 'admin' && !location.pathname.startsWith('/admin') && selectedRole !== 'member') {
            navigate('/admin');
            if (isFirstLogin) {
                setIsModalVisible(true);
            }
        } else if (user.role === 'admin' && selectedRole === null) {
            setIsModalVisible(true); // Ensure modal shows if no role is selected
        }
    }, [user, location.pathname, navigate, selectedRole]);

    const handleRoleSelect = useCallback(
        (role: 'admin' | 'member') => {
            setSelectedRole(role);
            localStorage.setItem('selectedRole', role);
            setIsModalVisible(false);
            navigate(role === 'admin' ? '/admin' : '/dashboard');
        },
        [navigate],
    );

    const handleSettingsClick = useCallback(() => {
        if (user?.role !== 'admin') {
            message.info({ key: 'settings', content: 'Tính năng này đang phát triển' });
            return;
        }
        setIsModalVisible(true);
    }, [user?.role, message]);

    const handleLogout = useCallback(() => {
        originalLogout();
        setSelectedRole(null);
        localStorage.removeItem('selectedRole');
        navigate('/login');
    }, [originalLogout, navigate]);

    const renderContent = useCallback(() => {
        return <Content className="bg-white">{children}</Content>;
    }, [children]);

    const routes = location.pathname.startsWith('/admin') ? adminSidebarRoutes : sidebarRoutes;

    return (
        <>
            {contextHolder}
            {user?.role === 'admin' && (
                <Modal
                    title="Chọn quyền truy cập"
                    open={isModalVisible}
                    onCancel={() => {
                        if (selectedRole === null) {
                            handleRoleSelect('member');
                        } else {
                            setIsModalVisible(false);
                        }
                    }}
                    footer={null}
                    centered
                    maskClosable={false}
                    closable={selectedRole !== null}
                >
                    <div className="text-center">
                        <p className="mb-6 text-gray-600">
                            Xin chào {user?.full_name}, bạn muốn truy cập hệ thống với quyền nào?
                        </p>
                        <Space size="large">
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => handleRoleSelect('admin')}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Quản trị viên
                            </Button>
                            <Button
                                size="large"
                                onClick={() => handleRoleSelect('member')}
                                className="hover:bg-gray-100"
                            >
                                Người dùng
                            </Button>
                        </Space>
                    </div>
                </Modal>
            )}

            <Layout className="min-h-screen bg-white">
                <Sidebar collapsed={collapsed} routes={routes} />
                <Layout className="transition-all duration-300 bg-white">
                    <Header
                        collapsed={collapsed}
                        onCollapse={handleCollapse}
                        user={user}
                        logout={handleLogout}
                        onSettingsClick={handleSettingsClick}
                    />
                    <div className="overflow-auto" style={{ height: 'calc(100vh - 64px)' }}>
                        {renderContent()}
                    </div>
                    <Footer />
                </Layout>
            </Layout>
        </>
    );
});

export default DefaultLayout;