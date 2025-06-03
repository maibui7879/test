import React, { useMemo, useCallback } from 'react';
import { Layout, Menu } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation, useNavigate } from 'react-router-dom';
import { sidebarRoutes } from '@/routes';
import SidebarFooter from './SidebarFooter';
import Route from '@/routes/type';

const { Sider } = Layout;

interface SidebarProps {
    collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = useMemo(() => {
        return sidebarRoutes.map((route) => {
            if (route.children?.length) {
                return {
                    key: route.path,
                    icon: route.icon && <FontAwesomeIcon icon={route.icon} className="text-lg" />,
                    label: route.name,
                    children: route.children.map((child: Route) => ({
                        key: `${route.path}/${child.path}`,
                        icon: child.icon && <FontAwesomeIcon icon={child.icon} className="text-lg" />,
                        label: child.name,
                    })),
                };
            }
            return {
                key: route.path,
                icon: route.icon && <FontAwesomeIcon icon={route.icon} className="text-lg" />,
                label: route.name,
            };
        });
    }, []);

    const handleMenuClick = useCallback(
        ({ key }: { key: string }) => {
            navigate(key);
        },
        [navigate],
    );

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            className="min-h-screen bg-gray-800 shadow-lg"
            width={256}
        >
            <div className="flex items-center justify-center p-4 border-b border-gray-700 h-16">
                <div
                    className="text-xl font-bold whitespace-nowrap"
                    style={{
                        background: 'linear-gradient(to right, #3b82f6, #9333ea)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    {collapsed ? 'TM' : 'Task Manager'}
                </div>
            </div>
            <>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={handleMenuClick}
                    className="bg-gray-800 border-r-0"
                    style={{
                        padding: '8px 0',
                        fontSize: '14px',
                    }}
                />
            </>
            <SidebarFooter collapsed={collapsed} />
        </Sider>
    );
};

export default Sidebar;
