import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import { publicRoutes, privateRoutes, sidebarRoutes, adminSidebarRoutes } from './routes';
import { UserProvider } from './contexts/useAuth/userContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './routes/ProtectedRoute';
import NotFoundPage from '@pages/404Page';

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

            const isAdminRoute = route.path.startsWith('/admin');
            const isPublicRoute = route.path === '/';
            const is404Route = route.path === '/404';

            if (route.children && route.children.length > 0) {
                return (
                    <Route
                        key={index}
                        path={route.path}
                        element={
                            Page ? (
                                isPublicRoute || is404Route ? (
                                    <Layout>
                                        <Page />
                                    </Layout>
                                ) : (
                                    <ProtectedRoute requireAdmin={isAdminRoute}>
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    </ProtectedRoute>
                                )
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
                            isPublicRoute || is404Route ? (
                                <Layout>
                                    <Page />
                                </Layout>
                            ) : (
                                <ProtectedRoute requireAdmin={isAdminRoute}>
                                    <Layout>
                                        <Page />
                                    </Layout>
                                </ProtectedRoute>
                            )
                        }
                    />
                );
            }
        });

    return (
        <UserProvider>
            <Router>
                <div className="App">
                    <Routes>
                        {renderRoutes(allRoutes)}
                        <Route path="*" element={<Navigate to="/404" replace />} />
                    </Routes>
                    <ToastContainer position="top-right" autoClose={2000} />
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
