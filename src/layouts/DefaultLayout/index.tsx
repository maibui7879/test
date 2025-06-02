import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DefaultLayoutProps from './type';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SidebarItem from './Sidebar/SidebarItem';
import { useUser } from '@contexts/useAuth/userContext';
import Route from '@/routes/type';
import { sidebarRoutes } from '@/routes';

function DefaultLayout({ children }: DefaultLayoutProps) {
    const { user, logout } = useUser();

    const renderSidebarItems = (routes: Route[]) => {
        return routes.map((route: Route) => {
            if (route.children?.length) {
                return (
                    <SidebarItem
                        key={route.path}
                        icon={route.icon && <FontAwesomeIcon icon={route.icon} />}
                        path={route.path}
                        label={route.name || ''}
                        subItems={route.children.map((child: Route) => ({
                            icon: child.icon && <FontAwesomeIcon icon={child.icon} />,
                            path: `${route.path}/${child.path}`,
                            label: child.name || '',
                        }))}
                    />
                );
            }
            return (
                <SidebarItem
                    key={route.path}
                    icon={route.icon && <FontAwesomeIcon icon={route.icon} />}
                    path={route.path}
                    label={route.name || ''}
                />
            );
        });
    };

    return (
        <div className="h-screen flex flex-col">
            <Header />
            <div className="flex-1 flex overflow-hidden">
                <Sidebar>{renderSidebarItems(sidebarRoutes)}</Sidebar>
                <main className="flex-1 overflow-auto bg-gray-50">
                    <div className="container mx-auto h-full p-4 sm:p-6 lg:p-8">{children}</div>
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
