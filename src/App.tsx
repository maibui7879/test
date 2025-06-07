import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import { publicRoutes, privateRoutes, sidebarRoutes, adminSidebarRoutes } from './routes';
import { UserProvider } from './contexts/useAuth/userContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const allRoutes = [...publicRoutes, ...privateRoutes, ...sidebarRoutes, ...adminSidebarRoutes];

    const renderRoutes = (routes: any[]) =>
        routes.map((route, index) => {
            const Page = route.component;
            let Layout: React.FC<{ children: React.ReactNode }> | React.ExoticComponent = DefaultLayout;

            if (route.layout === null) {
                Layout = Fragment;
            } else if (route.layout) {
                Layout = route.layout;
            }

            if (route.children && route.children.length > 0) {
                return (
                    <Route
                        key={index}
                        path={route.path}
                        element={
                            Page ? (
                                <Layout>
                                    <Page />
                                </Layout>
                            ) : undefined
                        }
                    >
                        {renderRoutes(route.children)}
                    </Route>
                );
            } else {
                return (
                    <Route
                        key={index}
                        path={route.path}
                        element={
                            <Layout>
                                <Page />
                            </Layout>
                        }
                    />
                );
            }
        });

    return (
        <UserProvider>
            <Router>
                <div className="App">
                    <Routes>{renderRoutes(allRoutes)}</Routes>
                    <ToastContainer position="top-right" autoClose={2000} />
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
