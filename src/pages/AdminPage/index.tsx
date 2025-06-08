import React, { useState } from 'react';
import { Tabs } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faChartBar, faHistory } from '@fortawesome/free-solid-svg-icons';
import UserManagement from './UserManagement';
import Statistics from './Statistics';
import UserLogs from './UserLogs';
import AdminLogs from './AdminLogs';

const AdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('users');

    const items = [
        {
            key: 'users',
            label: (
                <span className="flex items-center">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Quản lý người dùng
                </span>
            ),
            children: <UserManagement />,
        },
        {
            key: 'statistics',
            label: (
                <span className="flex items-center">
                    <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                    Thống kê
                </span>
            ),
            children: <Statistics />,
        },
        {
            key: 'user-logs',
            label: (
                <span className="flex items-center">
                    <FontAwesomeIcon icon={faHistory} className="mr-2" />
                    Lịch sử người dùng
                </span>
            ),
            children: <UserLogs />,
        },
        {
            key: 'admin-logs',
            label: (
                <span className="flex items-center">
                    <FontAwesomeIcon icon={faHistory} className="mr-2" />
                    Lịch sử Admin
                </span>
            ),
            children: <AdminLogs />,
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Quản trị hệ thống</h1>
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={items}
                className="bg-white p-4 rounded-lg shadow"
            />
        </div>
    );
};

export default AdminPage;
