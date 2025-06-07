import React, { useState, useEffect, useCallback } from 'react';
import { Avatar, Dropdown, Button, Badge, Space, Typography, List, Tag, Spin } from 'antd';
import {
    BellOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    CheckOutlined,
} from '@ant-design/icons';
import { useMessage } from '@/hooks/useMessage';
import { getReminders, markReminderRead } from '@services/remiderService';
import { Reminder, UserProfile } from '@services/types/types';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

interface HeaderProps {
    collapsed: boolean;
    onCollapse: () => void;
    user: UserProfile | null;
    logout: () => void;
}

const formatTimeAgo = (date: string): string => {
    const now = dayjs();
    const reminderDate = dayjs(date);
    const diffInMinutes = now.diff(reminderDate, 'minute');
    const diffInHours = now.diff(reminderDate, 'hour');
    const diffInDays = now.diff(reminderDate, 'day');

    if (diffInMinutes < 0) return reminderDate.format('DD/MM/YYYY HH:mm');
    if (diffInDays <= 3) {
        if (diffInDays > 0) return `${diffInDays} ngày trước`;
        if (diffInHours > 0) return `${diffInHours} giờ trước`;
        return `${diffInMinutes} phút trước`;
    }
    return reminderDate.format('DD/MM/YYYY HH:mm');
};

const isNewReminder = (date: string): boolean => {
    const now = dayjs();
    const reminderDate = dayjs(date);
    const diffInDays = now.diff(reminderDate, 'day');
    return diffInDays <= 1;
};

function Header({ collapsed, onCollapse, user, logout }: HeaderProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { message, contextHolder } = useMessage();
    const navigate = useNavigate();

    const fetchReminders = useCallback(async (pageNum: number = 1) => {
        try {
            setLoading(true);
            const response = await getReminders({
                is_read: '0',
                page: pageNum.toString(),
                limit: '5',
            });

            if (pageNum === 1) {
                setReminders(response.data);
            } else {
                setReminders((prev) => [...prev, ...response.data]);
            }

            setHasMore(response.data.length === 5);
            setPage(pageNum);
        } catch (error: any) {
            message.error(error.message || 'Không thể tải thông báo');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleMarkAsRead = useCallback(async (id: number) => {
        try {
            await markReminderRead(id);
            setReminders((prev) =>
                prev.map((reminder) => (reminder.id === id ? { ...reminder, is_read: true } : reminder)),
            );
            message.success({ key: 'markRead', content: 'Đã đánh dấu đã đọc' });
        } catch (error: any) {
            message.error({ key: 'markReadError', content: error.message || 'Không thể cập nhật trạng thái' });
        }
    }, []);

    const handleScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
            if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && hasMore) {
                fetchReminders(page + 1);
            }
        },
        [fetchReminders, loading, hasMore, page],
    );

    useEffect(() => {
        if (isNotificationOpen) {
            fetchReminders(1);
        }
    }, [isNotificationOpen, fetchReminders]);

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

    const notificationContent = (
        <div className="w-80 bg-white rounded-lg shadow-lg">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <Text strong className="text-gray-800">
                    Thông báo
                </Text>
                <Button type="link" onClick={() => navigate('/reminder')} className="text-blue-600 hover:text-blue-700">
                    Xem tất cả
                </Button>
            </div>
            <div className="max-h-96 overflow-y-auto bg-white" onScroll={handleScroll}>
                {loading && page === 1 ? (
                    <div className="flex justify-center p-4">
                        <Spin />
                    </div>
                ) : reminders.length > 0 ? (
                    <List
                        dataSource={reminders}
                        renderItem={(reminder) => (
                            <List.Item
                                key={reminder.id}
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                                actions={[
                                    !reminder.is_read && (
                                        <Button
                                            type="text"
                                            icon={<CheckOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsRead(reminder.id);
                                            }}
                                            className="text-green-600 hover:text-green-700"
                                        >
                                            Đánh dấu đã đọc
                                        </Button>
                                    ),
                                ]}
                            >
                                <List.Item.Meta
                                    title={
                                        <div className="flex items-center">
                                            <span className="font-medium text-gray-800">{reminder.mes}</span>
                                            {!reminder.is_read &&
                                                reminder.start_time &&
                                                isNewReminder(reminder.start_time) && (
                                                    <Tag color="blue" className="ml-2">
                                                        Mới
                                                    </Tag>
                                                )}
                                        </div>
                                    }
                                    description={
                                        reminder.start_time && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                {formatTimeAgo(reminder.start_time)}
                                            </p>
                                        )
                                    }
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <div className="p-4 text-center text-gray-500 bg-gray-50">Không có thông báo mới</div>
                )}
                {loading && page > 1 && (
                    <div className="flex justify-center p-2 bg-white">
                        <Spin size="small" />
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            {contextHolder}
            <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="flex items-start">
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={onCollapse}
                                className="!text-white hover:!text-gray-100 transition-colors duration-300"
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                        </div>

                        <div className="flex items-center">
                            <Space size="middle" className="mr-4">
                                <Dropdown
                                    overlay={notificationContent}
                                    trigger={['click']}
                                    open={isNotificationOpen}
                                    onOpenChange={setIsNotificationOpen}
                                    placement="bottomRight"
                                >
                                    <Badge
                                        count={reminders.filter((r) => !r.is_read).length}
                                        size="small"
                                        className="cursor-pointer"
                                        style={{
                                            boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.2)',
                                        }}
                                    >
                                        <Button
                                            type="text"
                                            icon={
                                                <BellOutlined className="text-white text-xl hover:text-gray-100 transition-all duration-300 ease-in-out transform hover:scale-110" />
                                            }
                                            className="hover:bg-white/10 rounded-full flex items-center justify-center w-10 h-10 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-white/20"
                                        />
                                    </Badge>
                                </Dropdown>

                                <Dropdown
                                    menu={{ items: userMenuItems }}
                                    trigger={['click']}
                                    open={isDropdownOpen}
                                    onOpenChange={setIsDropdownOpen}
                                    placement="bottomRight"
                                >
                                    <Button
                                        type="text"
                                        className="p-0 hover:bg-white/10 rounded-full flex items-center transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-white/20"
                                    >
                                        <Space className="px-2">
                                            <Text className="text-white text-sm font-medium md:block hover:text-gray-100 transition-colors duration-300">
                                                Xin chào, {user?.full_name || 'User'}
                                            </Text>
                                            <Avatar
                                                src={user?.avatar_url}
                                                icon={<UserOutlined />}
                                                className="border-2 border-white/30 hover:border-white/50 transition-all duration-300 ease-in-out transform hover:scale-105"
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
