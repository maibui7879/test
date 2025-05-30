import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import FaIcon from '@/utils/FaIconUtils';
import { SidebarItemProps } from './type';

function SidebarItem({
    icon,
    path,
    label,
    subItems,
    className = '',
    activeClassName = 'bg-indigo-600 text-white font-semibold shadow-md',
    inactiveClassName = 'text-gray-300 hover:bg-indigo-500 hover:text-white',
}: SidebarItemProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const renderNavLink = (to: string, icon: React.ReactNode, label: string) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center px-4 py-4 rounded-md transition-colors duration-200 whitespace-nowrap ${
                    isActive ? activeClassName : inactiveClassName
                } justify-center xl:justify-start ${className}`
            }
        >
            {icon && <span className="text-lg">{icon}</span>}
            <span className="ml-3 select-none hidden xl:inline">{label}</span>
        </NavLink>
    );

    const renderSubItems = () => {
        if (!subItems?.length) return null;

        return (
            <>
                {isOpen && (
                    <ul className="pl-6 mt-1 space-y-1 hidden xl:block">
                        {subItems.map((item, idx) => (
                            <li key={idx}>{renderNavLink(item.path, item.icon, item.label)}</li>
                        ))}
                    </ul>
                )}

                {isHovered && (
                    <ul
                        className="absolute left-full top-0 ml-2 w-48 bg-gray-800 shadow-lg rounded-md p-2 z-50 flex flex-col xl:hidden"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {subItems.map((item, idx) => (
                            <li key={idx}>{renderNavLink(item.path, item.icon, item.label)}</li>
                        ))}
                    </ul>
                )}
            </>
        );
    };

    if (!subItems?.length) {
        return renderNavLink(path, icon, label);
    }

    return (
        <div className="mb-2 relative group">
            <button
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`flex items-center w-full px-4 py-4 text-indigo-400 hover:text-indigo-300 focus:outline-none justify-center xl:justify-start ${className}`}
            >
                {icon && <span className="text-lg">{icon}</span>}
                <span className="ml-3 hidden xl:inline">{label}</span>
                <span className="ml-auto hidden xl:inline">
                    <FaIcon icon={isOpen ? FaChevronDown : FaChevronRight} />
                </span>
            </button>
            {renderSubItems()}
        </div>
    );
}

export default SidebarItem;
