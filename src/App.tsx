import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import { publicRoutes, privateRoutes } from './routes';
import { UserProvider } from './contexts/useAuth/userContext';

function App() {
    const routes = [...publicRoutes, ...privateRoutes];

    const renderRoutes = (routes: any[]) =>
        routes.map((route, index) => {
            const Page = route.component;
            let Layout: React.FC<{ children: React.ReactNode }> | React.ExoticComponent = DefaultLayout;

            if (route.layout === null) {
                Layout = Fragment;
            } else if (route.layout) {
                Layout = route.layout;
            }

            return (
                <Route key={index} path={route.path}>
                    <Route
                        index
                        element={
                            <Layout>
                                <Page />
                            </Layout>
                        }
                    />
                    {route.children && renderRoutes(route.children)}
                </Route>
            );
        });

    return (
        <UserProvider>
            <Router>
                <div className="App">
                    <Routes>{renderRoutes(routes)}</Routes>
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
