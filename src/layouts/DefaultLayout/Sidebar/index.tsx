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
                icon: route.icon && (
                    <div className="w-5 flex justify-center items-center">
                        <FontAwesomeIcon
                            icon={route.icon}
                            className="text-lg transition-transform duration-300 hover:scale-110"
                        />
                    </div>
                ),
                label: (
                    <div className="flex items-center gap-x-2">
                        {route.name}
                    </div>
                ),
                children: route.children.map((child: Route) => ({
                    key: `${route.path}/${child.path}`,
                    icon: child.icon && (
                        <div className="w-5 flex justify-center items-center">
                            <FontAwesomeIcon
                                icon={child.icon}
                                className="text-lg transition-transform duration-300 hover:scale-110"
                            />
                        </div>
                    ),
                    label: (
                        <div className="flex items-center gap-x-2">
                            {child.name}
                        </div>
                    ),
                })),
            };
        }

        return {
            key: route.path,
            icon: route.icon && (
                <div className="w-5 flex justify-center items-center">
                    <FontAwesomeIcon
                        icon={route.icon}
                        className="text-lg transition-transform duration-300 hover:scale-110"
                    />
                </div>
            ),
            label: (
                <div className="flex items-center gap-x-2">
                    {route.name}
                </div>
            ),
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
            className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl transition-all duration-300"
            width={256}
        >
            <div className="flex items-center justify-center p-4 border-b border-gray-700/50 h-16 backdrop-blur-sm">
                <div
                    className="text-xl font-bold whitespace-nowrap transition-all duration-300"
                    style={{
                        background: 'linear-gradient(to right, #3b82f6, #9333ea)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
                    className="bg-transparent border-r-0"
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
