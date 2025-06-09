import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout, Menu } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarFooter from './SidebarFooter';
import Route from '@/routes/type';

const { Sider } = Layout;

interface SidebarProps {
    collapsed: boolean;
    onCollapse?: (collapsed: boolean) => void;
    routes: Route[];
}

const Sidebar = ({ collapsed, onCollapse, routes }: SidebarProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth <= 768;

    useEffect(() => {
        if (onCollapse) {
            onCollapse(isMobile);
        }
    }, [isMobile, onCollapse]);

    const width = isMobile ? 200 : 256;
    const collapsedWidth = isMobile ? 40 : 60;

    const getMenuItem = useCallback((route: Route) => {
        const renderIcon = (icon?: any) => {
            if (!icon) return null;
            return (
                <div className="flex items-center justify-center w-4 h-4">
                    <FontAwesomeIcon icon={icon} className="text-sm" />
                </div>
            );
        };

        if (route.children?.length) {
            return {
                key: route.path,
                icon: renderIcon(route.icon),
                label: route.name,
                children: route.children.map((child) => ({
                    key: `${route.path}/${child.path}`,
                    icon: renderIcon(child.icon),
                    label: child.name,
                })),
            };
        }

        return {
            key: route.path,
            icon: renderIcon(route.icon),
            label: route.name,
        };
    }, []);

    const menuItems = useMemo(() => routes.map(getMenuItem), [routes, getMenuItem]);

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
            onCollapse={onCollapse}
            width={width}
            collapsedWidth={collapsedWidth}
            className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl transition-all duration-300"
            breakpoint="md" // md = 768px
            onBreakpoint={(broken) => {
                if (onCollapse) onCollapse(broken);
            }}
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
                style={{ padding: '8px 0', fontSize: '13px' }}
                inlineCollapsed={collapsed}
            />
            <SidebarFooter collapsed={collapsed} />
        </Sider>
    );
};

export default Sidebar;
