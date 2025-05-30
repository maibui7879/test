import React from 'react';
import SidebarItem from './SidebarItem';
import SidebarHeader from './SidebarHeader';
import SidebarFooter from './SidebarFooter';

interface SidebarItem {
    icon?: React.ReactNode;
    path: string;
    label: string;
    subItems?: {
        icon?: React.ReactNode;
        path: string;
        label: string;
    }[];
}

interface SidebarProps {
    items: SidebarItem[];
    header?: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ items, header, footer, className = '' }) => {
    return (
        <div className={`flex flex-col h-full bg-gray-900 ${className}`}>
            {header && <div className="text-white text-xl font-bold p-4">{header}</div>}

            <nav className="flex-1 overflow-y-auto px-2 py-4">
                {items.map((item, index) => (
                    <SidebarItem
                        key={index}
                        icon={item.icon}
                        path={item.path}
                        label={item.label}
                        subItems={item.subItems}
                    />
                ))}
            </nav>

            {footer && <div className="text-white text-sm p-4">{footer}</div>}
        </div>
    );
};

export default Sidebar;
