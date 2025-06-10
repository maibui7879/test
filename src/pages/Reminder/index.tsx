import React, { useState, useEffect, useCallback } from 'react';
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

const ReminderPage = () => {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'unread' | 'read'>('unread');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
    });

    const fetchReminders = useCallback(
        async (page: number = 1) => {
            try {
                setLoading(true);
                const params: any = {
                    is_read: filter === 'read' ? '1' : '0',
                    page: page.toString(),
                    limit: pagination.pageSize.toString(),
                };

                if (typeFilter && typeFilter !== 'all') {
                    params.type = typeFilter;
                }

                const response = await getReminders(params);
                setReminders(response.data);
                setPagination((prev) => ({
                    ...prev,
                    current: response.pagination.page,
                    total: response.pagination.total,
                    totalPages: response.pagination.totalPages,
                }));
            } catch (error: any) {
                message.error(error.message || 'Không thể tải danh sách nhắc nhở');
            } finally {
                setLoading(false);
            }
        },
        [filter, typeFilter, pagination.pageSize],
    );

    const handleMarkAsRead = useCallback(
        async (id: number) => {
            try {
                await markReminderRead(id);
                setReminders((prev) =>
                    prev.map((reminder) => (reminder.id === id ? { ...reminder, is_read: true } : reminder)),
                );
                message.success('Đã đánh dấu đã đọc');
                if (filter === 'unread') {
                    fetchReminders(pagination.current);
                }
            } catch (error: any) {
                message.error(error.message || 'Không thể cập nhật trạng thái');
            }
        },
        [filter, fetchReminders, pagination],
    );

    const handlePageChange = useCallback(
        (page: number) => {
            fetchReminders(page);
        },
        [fetchReminders],
    );

    const handleFilterChange = useCallback((value: 'unread' | 'read') => {
        setFilter(value);
        setPagination((prev) => ({ ...prev, current: 1 }));
    }, []);

    const handleTypeFilterChange = useCallback((value: string) => {
        setTypeFilter(value);
        setPagination((prev) => ({ ...prev, current: 1 }));
    }, []);

    useEffect(() => {
        fetchReminders(1);
    }, [filter, typeFilter, fetchReminders]);

    const getTypeColor = (type: string | undefined) => {
        switch (type) {
            case 'task':
                return 'green';
            case 'assignment':
                return 'blue';
            case 'meeting':
                return 'purple';
            case 'deadline':
                return 'red';
            default:
                return 'default';
        }
    };

    const getTypeLabel = (type: string | undefined) => {
        switch (type) {
            case 'task':
                return 'Công việc';
            case 'assignment':
                return 'Phân công';
            default:
                return type;
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                    <BellOutlined className="mr-2" />
                    Nhắc nhở
                </h1>
            </div>

            <div className="mb-4">
                <Segmented
                    value={typeFilter}
                    onChange={handleTypeFilterChange}
                    options={[
                        { value: 'all', label: 'Tất cả' },
                        { value: 'task', label: 'Công việc' },
                        { value: 'assignment', label: 'Phân công' },
                    ]}
                />
            </div>

            <Card>
                <div className="mb-4">
                    <Segmented
                        value={filter}
                        onChange={handleFilterChange}
                        options={[
                            { value: 'unread', label: 'Chưa đọc' },
                            { value: 'read', label: 'Đã đọc' },
                        ]}
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
                            renderItem={(reminder) => (
                                <List.Item
                                    key={reminder.id}
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
                                                {!reminder.is_read &&
                                                    reminder.start_time &&
                                                    isNewReminder(reminder.start_time) && (
                                                        <Tag color="blue" className="ml-2">
                                                            Mới
                                                        </Tag>
                                                    )}
                                                {reminder.type && (
                                                    <Tag color={getTypeColor(reminder.type)} className="ml-2">
                                                        {getTypeLabel(reminder.type)}
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
                            )}
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
