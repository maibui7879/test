import React, { useState, useEffect } from 'react';
import { Card, List, Tag, Button, Empty, Spin, message, Segmented, Pagination } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { getReminders, markReminderRead } from '@services/remiderService';
import { Reminder } from '@services/types/types';
import dayjs from 'dayjs';

interface PaginationState {
    current: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

const formatTimeAgo = (date: string): string => {
    const now = dayjs();
    const reminderDate = dayjs(date);
    const diffInMinutes = now.diff(reminderDate, 'minute');
    const diffInHours = now.diff(reminderDate, 'hour');
    const diffInDays = now.diff(reminderDate, 'day');

    // Nếu thời gian trong tương lai
    if (diffInMinutes < 0) {
        return reminderDate.format('DD/MM/YYYY HH:mm');
    }

    // Trong khoảng 3 ngày
    if (diffInDays <= 3) {
        if (diffInDays > 0) {
            return `${diffInDays} ngày trước`;
        }
        if (diffInHours > 0) {
            return `${diffInHours} giờ trước`;
        }
        return `${diffInMinutes} phút trước`;
    }

    // Hơn 3 ngày thì hiển thị ngày tháng năm giờ
    return reminderDate.format('DD/MM/YYYY HH:mm');
};

const ReminderPage = () => {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'unread' | 'read'>('unread');
    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
    });

    const fetchReminders = async (page: number = 1) => {
        console.log('fetchReminders called with page:', page, 'filter:', filter);
        try {
            setLoading(true);
            console.log('Calling API with params:', {
                is_read: filter === 'read' ? '1' : '0',
                page: page.toString(),
                limit: pagination.pageSize.toString(),
            });
            const response = await getReminders({
                is_read: filter === 'read' ? '1' : '0',
                page: page.toString(),
                limit: pagination.pageSize.toString(),
            });
            console.log('API Response:', response);

            setReminders(response.data);
            setPagination((prev) => ({
                ...prev,
                current: response.pagination.page,
                total: response.pagination.total,
                totalPages: response.pagination.totalPages,
            }));
        } catch (error: any) {
            console.error('Error in fetchReminders:', error);
            message.error(error.message || 'Không thể tải danh sách nhắc nhở');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('useEffect triggered - filter changed to:', filter);
        fetchReminders(1);
    }, [filter]);

    const handleMarkAsRead = async (id: number) => {
        console.log('handleMarkAsRead called for reminder ID:', id);
        try {
            await markReminderRead(id);
            console.log('Successfully marked reminder as read, updating UI');
            setReminders((prev) =>
                prev.map((reminder) => {
                    console.log('Checking reminder:', reminder.id, 'against ID:', id);
                    return reminder.id === id ? { ...reminder, is_read: true } : reminder;
                }),
            );
            message.success('Đã đánh dấu đã đọc');
            if (filter === 'unread') {
                console.log('Refreshing reminders after mark as read');
                fetchReminders(pagination.current);
            }
        } catch (error: any) {
            console.error('Error in handleMarkAsRead:', error);
            message.error(error.message || 'Không thể cập nhật trạng thái');
        }
    };

    const handlePageChange = (page: number) => {
        console.log('handlePageChange called with page:', page);
        fetchReminders(page);
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
                        onChange={(value) => {
                            console.log('Tab changed to:', value);
                            setFilter(value as 'unread' | 'read');
                            setPagination((prev) => ({ ...prev, current: 1 }));
                        }}
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
                    <>
                        <List
                            itemLayout="horizontal"
                            dataSource={reminders}
                            renderItem={(reminder) => {
                                console.log('Rendering reminder:', reminder);
                                return (
                                    <List.Item
                                        key={reminder.id}
                                        actions={[
                                            !reminder.is_read && (
                                                <Button
                                                    type="text"
                                                    icon={<CheckOutlined />}
                                                    onClick={() => {
                                                        console.log(
                                                            'Mark as read button clicked for reminder:',
                                                            reminder,
                                                        );
                                                        handleMarkAsRead(reminder.id);
                                                    }}
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
                                                    {reminder.start_time && (
                                                        <p className="text-gray-600">
                                                            Thời gian: {formatTimeAgo(reminder.start_time)}
                                                        </p>
                                                    )}
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                );
                            }}
                        />
                        <div className="flex justify-center mt-4">
                            <Pagination
                                current={pagination.current}
                                pageSize={pagination.pageSize}
                                total={pagination.total}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                showQuickJumper
                            />
                        </div>
                    </>
                ) : (
                    <Empty description="Không có nhắc nhở nào" className="py-12" />
                )}
            </Card>
        </div>
    );
};

export default ReminderPage;
