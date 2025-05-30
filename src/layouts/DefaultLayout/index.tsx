import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DefaultLayoutProps from './type';
import Sidebar from './Sidebar';
import FaIcon from '../../utils/FaIconUtils';
import SidebarItem from './Sidebar/SidebarItem';
import { useUser } from '@contexts/useAuth/userContext';
import Route from '@/routes/type';
import { privateRoutes } from '@/routes';

function DefaultLayout({ children }: DefaultLayoutProps) {
    const { user, logout } = useUser();

    const renderSidebarItems = (routes: Route[]) => {
        return routes.map((route: Route) => {
            if (route.children?.length) {
                return (
                    <SidebarItem
                        key={route.path}
                        icon={route.icon && <FaIcon icon={route.icon} />}
                        path={route.path}
                        label={route.name || ''}
                        subItems={route.children.map((child: Route) => ({
                            icon: child.icon && <FaIcon icon={child.icon} />,
                            path: `${route.path}/${child.path}`,
                            label: child.name || '',
                        }))}
                    />
                );
            }
            return (
                <SidebarItem
                    key={route.path}
                    icon={route.icon && <FaIcon icon={route.icon} />}
                    path={route.path}
                    label={route.name || ''}
                />
            );
        });
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-1">
                <Sidebar>{renderSidebarItems(privateRoutes)}</Sidebar>
                <main className="flex-grow px-4 sm:px-6 lg:px-8">{children}</main>
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
