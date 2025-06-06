import React, { useState } from 'react';
import { useUser } from '@contexts/useAuth/userContext';
import { Avatar, Dropdown, Button, Badge, Space, Typography } from 'antd';
import {
    BellOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useMessage } from '@/hooks/useMessage';

const { Text } = Typography;

interface HeaderProps {
    collapsed: boolean;
    onCollapse: () => void;
}

function Header({ collapsed, onCollapse }: HeaderProps) {
    const { user, logout } = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { message, contextHolder } = useMessage();

    const handleLogout = () => {
        message.loading({ key: 'logout', content: 'Đang đăng xuất...' });
        logout();
    };

    const userMenuItems = [
        {
            key: 'profile',
            label: 'Thông tin cá nhân',
            icon: <UserOutlined />,
            onClick: () => {},
        },
        {
            key: 'settings',
            label: 'Cài đặt',
            icon: <SettingOutlined />,
            onClick: () => {},
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
            danger: true,
        },
    ];

    return (
        <>
            {contextHolder}
            <nav className="bg-gradient-to-r from-[#3b82f6] to-[#9333ea] shadow-lg">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="flex items-start">
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={onCollapse}
                                className="!text-gray-300 hover:!text-white transition-colors duration-300"
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                        </div>

                        <div className="flex items-center">
                            <Space size="middle" className="mr-4">
                                <Badge
                                    count={5}
                                    size="small"
                                    className="cursor-pointer"
                                    style={{
                                        boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.2)',
                                    }}
                                >
                                    <Button
                                        type="text"
                                        icon={
                                            <BellOutlined className="text-gray-300 text-xl hover:text-white transition-all duration-300 ease-in-out transform hover:scale-110" />
                                        }
                                        className="hover:bg-gray-700/50 rounded-full flex items-center justify-center w-10 h-10 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-gray-900/50"
                                    />
                                </Badge>

                                <Dropdown
                                    menu={{ items: userMenuItems }}
                                    trigger={['click']}
                                    open={isDropdownOpen}
                                    onOpenChange={setIsDropdownOpen}
                                    placement="bottomRight"
                                >
                                    <Button
                                        type="text"
                                        className="p-0 hover:bg-gray-700/50 rounded-full flex items-center transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-gray-900/50"
                                    >
                                        <Space className="px-2">
                                            <Text className="text-gray-300 text-sm font-medium md:block hover:text-white transition-colors duration-300">
                                                Xin chào, {user?.full_name || 'User'}
                                            </Text>
                                            <Avatar
                                                src={user?.avatar_url}
                                                icon={<UserOutlined />}
                                                className="border-2 border-gray-600 hover:border-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105"
                                            />
                                        </Space>
                                    </Button>
                                </Dropdown>
                            </Space>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Header;
