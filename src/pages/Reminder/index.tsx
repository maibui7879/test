import React, { useState, useEffect } from 'react';
import { Card, List, Tag, Button, Empty, Spin, message, Segmented } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { getReminders, markReminderRead } from '@services/remiderService';
import { Reminder } from '@services/types/types';
import dayjs from 'dayjs';

const ReminderPage = () => {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'unread' | 'read'>('unread');

    const fetchReminders = async () => {
        try {
            setLoading(true);
            const response = await getReminders();
            let filteredReminders = response || [];

            if (filter === 'unread') {
                filteredReminders = filteredReminders.filter((reminder) => !reminder.is_read);
            } else {
                filteredReminders = filteredReminders.filter((reminder) => reminder.is_read);
            }

            setReminders(filteredReminders);
        } catch (error: any) {
            message.error(error.message || 'Không thể tải danh sách nhắc nhở');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReminders();
    }, [filter]);

    const handleMarkAsRead = async (id: number) => {
        try {
            await markReminderRead(id);
            setReminders((prev) =>
                prev.map((reminder) => (reminder.id === id ? { ...reminder, is_read: true } : reminder)),
            );
            message.success('Đã đánh dấu đã đọc');
            if (filter === 'unread') {
                fetchReminders();
            }
        } catch (error: any) {
            message.error(error.message || 'Không thể cập nhật trạng thái');
        }
    };

    const formatDate = (date: string) => {
        const now = dayjs();
        const reminderDate = dayjs(date);
        const diff = now.diff(reminderDate, 'minute');

        if (diff < 60) {
            return `${diff} phút trước`;
        } else if (diff < 1440) {
            return `${Math.floor(diff / 60)} giờ trước`;
        } else {
            return reminderDate.format('DD/MM/YYYY HH:mm');
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                    <BellOutlined className="mr-2" />
                    Nhắc nhở
                </h1>
            </div>

            <Card>
                <div className="mb-4">
                    <Segmented
                        value={filter}
                        onChange={(value) => setFilter(value as 'unread' | 'read')}
                        options={[
                            { value: 'unread', label: 'Chưa đọc' },
                            { value: 'read', label: 'Đã đọc' },
                        ]}
                        className="mb-4"
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spin size="large" />
                    </div>
                ) : reminders.length > 0 ? (
                    <List
                        itemLayout="horizontal"
                        dataSource={reminders}
                        renderItem={(reminder) => (
                            <List.Item
                                actions={[
                                    !reminder.is_read && (
                                        <Button
                                            type="text"
                                            icon={<CheckOutlined />}
                                            onClick={() => handleMarkAsRead(reminder.id)}
                                            className="text-green-500 hover:text-green-600"
                                        >
                                            Đánh dấu đã đọc
                                        </Button>
                                    ),
                                ]}
                            >
                                <List.Item.Meta
                                    title={
                                        <div className="flex items-center">
                                            <span className="font-medium">{reminder.mes}</span>
                                            {!reminder.is_read && (
                                                <Tag color="blue" className="ml-2">
                                                    Mới
                                                </Tag>
                                            )}
                                        </div>
                                    }
                                    description={
                                        <div className="space-y-2">
                                            <p className="text-gray-600">
                                                {reminder.start_time && `Bắt đầu: ${formatDate(reminder.start_time)}`}
                                                {reminder.end_time && ` - Kết thúc: ${formatDate(reminder.end_time)}`}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {formatDate(reminder.created_at || '')}
                                            </p>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <Empty description="Không có nhắc nhở nào" className="py-12" />
                )}
            </Card>
        </div>
    );
};

export default ReminderPage;
