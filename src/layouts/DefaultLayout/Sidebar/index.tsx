import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import type Route from '../../../routes/type';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import FaIcon from '../../../utils/FaIconUtils';
import SidebarHeader from './SidebarHeader';
import SidebarFooter from './SidebarFooter';

interface SidebarProps {
    routes: Route[];
}

const Sidebar: React.FC<SidebarProps> = ({ routes }) => {
    const [openParents, setOpenParents] = useState<{ [key: string]: boolean }>({});
    const [hoveredParent, setHoveredParent] = useState<string | null>(null);

    const toggleParent = (path: string) => {
        setOpenParents((prev) => ({
            ...prev,
            [path]: !prev[path],
        }));
    };

    const renderRouteName = (route: Route) =>
        route.name ?? (route.path === '/' ? 'DASHBOARD' : route.path.replace('/', '').replace(/-/g, ' ').toUpperCase());

    const renderNavLink = (to: string, icon: any, label: string) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center px-4 py-4 rounded-md transition-colors duration-200 whitespace-nowrap ${
                    isActive
                        ? 'bg-indigo-600 text-white font-semibold shadow-md'
                        : 'text-gray-300 hover:bg-indigo-500 hover:text-white'
                } justify-center xl:justify-start`
            }
        >
            {icon && <FaIcon icon={icon} className="text-lg" />}
            <span className="ml-3 select-none hidden xl:inline">{label}</span>
        </NavLink>
    );

    return (
        <nav className="relative bg-gray-900 min-h-screen py-6 w-20 xl:w-[250px] transition-all duration-300">
            <SidebarHeader />
            {routes.map((route, idx) => {
                const Icon = route.icon;
                const isOpen = openParents[route.path];
                const label = renderRouteName(route);
                const hasChildren = route.children?.length;

                return (
                    <div key={idx} className="mb-2 relative group">
                        {hasChildren ? (
                            <>
                                <button
                                    onClick={() => toggleParent(route.path)}
                                    onMouseEnter={() => setHoveredParent(route.path)}
                                    onMouseLeave={() => setHoveredParent(null)}
                                    className="flex items-center w-full px-4 py-4 text-indigo-400 hover:text-indigo-300 focus:outline-none justify-center xl:justify-start"
                                >
                                    {Icon && <FaIcon icon={Icon} className="text-lg" />}
                                    <span className="ml-3 hidden xl:inline">{label}</span>
                                    <span className="ml-auto hidden xl:inline">
                                        <FaIcon icon={isOpen ? FaChevronDown : FaChevronRight} />
                                    </span>
                                </button>

                                {isOpen && (
                                    <ul className="pl-6 mt-1 space-y-1 hidden xl:block">
                                        {route.children!.map((child, cidx) => {
                                            const fullPath = `${route.path}/${child.path}`.replace(/\/+/g, '/');
                                            return (
                                                <li key={cidx}>
                                                    {renderNavLink(fullPath, child.icon, renderRouteName(child))}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}

                                {hoveredParent === route.path && (
                                    <ul
                                        className="absolute left-full top-0 ml-2 w-48 bg-gray-800 shadow-lg rounded-md p-2 z-50 flex flex-col xl:hidden"
                                        onMouseEnter={() => setHoveredParent(route.path)}
                                        onMouseLeave={() => setHoveredParent(null)}
                                    >
                                        {route.children!.map((child, cidx) => {
                                            const fullPath = `${route.path}/${child.path}`.replace(/\/+/g, '/');
                                            return (
                                                <li key={cidx}>
                                                    {renderNavLink(fullPath, child.icon, renderRouteName(child))}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </>
                        ) : (
                            renderNavLink(route.path, Icon, label)
                        )}
                    </div>
                );
            })}
            <SidebarFooter />
        </nav>
    );
};

export default Sidebar;
