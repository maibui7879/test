import React, { useMemo, useCallback, useState, useEffect } from 'react';
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
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth <= 768 ? 200 : 256,
        collapsedWidth: window.innerWidth <= 768 ? 40 : 60,
    });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth <= 768 ? 200 : 256,
                collapsedWidth: window.innerWidth <= 768 ? 40 : 60,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getMenuItem = useCallback((route: Route) => {
        const icon = route.icon && (
            <FontAwesomeIcon icon={route.icon} className="text-lg transition-transform duration-300 hover:scale-110" />
        );

        if (route.children?.length) {
            return {
                key: route.path,
                icon,
                label: route.name,
                children: route.children.map((child) => ({
                    key: `${route.path}/${child.path}`,
                    icon: child.icon && (
                        <FontAwesomeIcon
                            icon={child.icon}
                            className="text-lg transition-transform duration-300 hover:scale-110"
                        />
                    ),
                    label: child.name,
                })),
            };
        }

        return {
            key: route.path,
            icon,
            label: route.name,
        };
    }, []);

    const menuItems = useMemo(() => {
        return sidebarRoutes.map((route) => getMenuItem(route));
    }, [getMenuItem]);

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
            // theme="light"
            className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl transition-all duration-300"
            width={dimensions.width}
            breakpoint="lg"
            collapsedWidth={dimensions.collapsedWidth}
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
                inlineCollapsed={collapsed}
            />
            <SidebarFooter collapsed={collapsed} />
        </Sider>
    );
};

export default Sidebar;
