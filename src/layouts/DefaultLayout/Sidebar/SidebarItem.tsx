import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { SidebarItemProps } from './type';

function SidebarItem({
    icon,
    path,
    label,
    subItems,
    className = '',
    activeClassName = 'text-blue-300 text-white font-medium shadow-md',
    inactiveClassName = 'text-gray-300 hover:bg-gray-700 hover:text-white',
}: SidebarItemProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const location = useLocation();

    const isChildActive = subItems?.some((item) => location.pathname === item.path);
    const parentActiveClassName = isChildActive ? 'text-blue-400' : 'text-gray-300';

    const renderNavLink = (to: string, icon: React.ReactNode, label: string) => (
        <NavLink
            to={to}
            end
            className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-md transition-colors duration-200 whitespace-nowrap ${
                    isActive ? activeClassName : inactiveClassName
                } justify-center xl:justify-start ${className}`
            }
        >
            {icon && <span className="text-lg m">{icon}</span>}
            <span className="ml-3 select-none hidden xl:inline">{label}</span>
        </NavLink>
    );

    const renderSubItems = () => {
        if (!subItems?.length) return null;

        return (
            <>
                {isOpen && (
                    <ul className="pl-6 mt-2 space-y-2 hidden xl:block">
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
                className={`flex items-center w-full px-4 py-3 rounded-md transition-colors duration-200 justify-center xl:justify-start ${parentActiveClassName} hover:text-white hover:bg-gray-700 ${className}`}
            >
                {icon && <span className="text-lg">{icon}</span>}
                <span className="ml-3 hidden xl:inline">{label}</span>
                <span className="ml-auto hidden xl:inline">
                    <FontAwesomeIcon icon={isOpen ? faChevronDown : faChevronRight} />
                </span>
            </button>
            {renderSubItems()}
        </div>
    );
}

export default SidebarItem;
