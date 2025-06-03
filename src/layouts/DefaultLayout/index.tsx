import React, { useCallback, useState } from 'react';
import { Layout } from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DefaultLayoutProps from './type';
import Sidebar from './Sidebar';

const { Content } = Layout;

const DefaultLayout: React.FC<DefaultLayoutProps> = React.memo(({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    const handleCollapse = useCallback(() => {
        setCollapsed((prev) => !prev);
    }, []);

    const renderContent = useCallback(() => {
        return <Content className=" bg-white shadow-sm">{children}</Content>;
    }, [children]);

    return (
        <Layout className="min-h-screen bg-white">
            <Sidebar collapsed={collapsed} />
            <Layout className="transition-all duration-300 bg-white">
                <Header collapsed={collapsed} onCollapse={handleCollapse} />
                <div className=" overflow-auto" style={{ height: 'calc(100vh - 64px)' }}>
                    {renderContent()}
                </div>
                <Footer />
            </Layout>
        </Layout>
    );
});

export default DefaultLayout;
