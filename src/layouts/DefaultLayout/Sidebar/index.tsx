import React from 'react';
import SidebarHeader from './SidebarHeader';
import SidebarFooter from './SidebarFooter';

interface SidebarProps {
    children: React.ReactNode;
    className?: string;
    header?: React.ReactNode;
    footer?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children, className = '', header, footer }) => {
    return (
        <nav
            className={`relative bg-gray-900 min-h-screen py-6 w-20 xl:w-[250px] transition-all duration-300 ${className}`}
        >
            {header || <SidebarHeader />}
            <div className="mt-6">{children}</div>
            {footer || <SidebarFooter />}
        </nav>
    );
};

export default Sidebar;
