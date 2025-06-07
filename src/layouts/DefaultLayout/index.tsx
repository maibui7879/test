import React, { useCallback, useState, useEffect } from 'react';
import { Layout, Modal, Button, Space } from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DefaultLayoutProps from './type';
import Sidebar from './Sidebar';
import { sidebarRoutes, adminSidebarRoutes } from '@/routes';
import { useUser } from '@contexts/useAuth/userContext';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;

const DefaultLayout = React.memo(({ children }: DefaultLayoutProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useUser();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'admin' | 'member' | null>(null);
    const navigate = useNavigate();

    const handleCollapse = useCallback(() => {
        setCollapsed((prev) => !prev);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setCollapsed(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (user?.role === 'admin' && selectedRole === null) {
            setIsModalVisible(true);
        }
    }, [user, selectedRole]);

    const handleRoleSelect = (role: 'admin' | 'member') => {
        setSelectedRole(role);
        setIsModalVisible(false);
        if (role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/dashboard');
        }
    };

    const renderContent = useCallback(() => {
        return <Content className="bg-white">{children}</Content>;
    }, [children]);

    const routes = selectedRole === 'admin' ? adminSidebarRoutes : sidebarRoutes;

    return (
        <>
            {user?.role === 'admin' && (
                <Modal
                    title="Chọn quyền truy cập"
                    open={isModalVisible}
                    onCancel={() => handleRoleSelect('member')}
                    footer={null}
                    centered
                    maskClosable={false}
                    closable={false}
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
                    <Header collapsed={collapsed} onCollapse={handleCollapse} user={user} logout={logout} />
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
