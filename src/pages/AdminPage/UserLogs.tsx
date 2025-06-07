import React, { useState, useEffect, Key } from 'react';
import { Table, Card, DatePicker, Select, Space, Button, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { getUserLogsApi } from '../../services/adminServices';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { ColumnsType } from 'antd/es/table';
import type { UserLog, GetUserLogsResponse } from '../../services/types/types';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const UserLogs: React.FC = () => {
    const [logs, setLogs] = useState<UserLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<UserLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
    const [actionFilter, setActionFilter] = useState<string | null>(null);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await getUserLogsApi({});
            if (response?.data) {
                setLogs(response.data.logs);
                setFilteredLogs(response.data.logs);
            }
        } catch (error) {
            message.error('Không thể tải lịch sử hoạt động');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const columns: ColumnsType<UserLog> = [
        {
            title: 'Thời gian',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm:ss'),
            sorter: (a: UserLog, b: UserLog) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a: UserLog, b: UserLog) => a.email.localeCompare(b.email),
        },
        {
            title: 'Họ và tên',
            dataIndex: 'full_name',
            key: 'full_name',
            sorter: (a: UserLog, b: UserLog) => a.full_name.localeCompare(b.full_name),
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            filters: [
                { text: 'Đăng nhập', value: 'LOGIN' },
                { text: 'Đăng xuất', value: 'LOGOUT' },
                { text: 'Tạo nhóm', value: 'CREATE_TEAM' },
                { text: 'Cập nhật thông tin', value: 'UPDATE_PROFILE' },
                { text: 'Admin - Xem lịch sử tham gia', value: 'Admin - Xem lịch sử tham gia' },
            ],
            onFilter: (value: boolean | Key, record: UserLog) => record.action === value,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Địa chỉ IP',
            dataIndex: 'ip_address',
            key: 'ip_address',
        },
    ];

    const handleDateRangeChange: RangePickerProps['onChange'] = (dates) => {
        if (dates && dates[0] && dates[1]) {
            setDateRange([dates[0], dates[1]]);
            filterLogs(dates[0], dates[1], actionFilter);
        } else {
            setDateRange(null);
            filterLogs(null, null, actionFilter);
        }
    };

    const handleActionFilterChange = (value: string) => {
        setActionFilter(value);
        filterLogs(dateRange?.[0] ?? null, dateRange?.[1] ?? null, value);
    };

    const filterLogs = (startDate: dayjs.Dayjs | null, endDate: dayjs.Dayjs | null, action: string | null) => {
        let filtered = [...logs];

        if (startDate && endDate) {
            filtered = filtered.filter((log) => {
                const logDate = dayjs(log.created_at);
                return logDate.isAfter(startDate) && logDate.isBefore(endDate);
            });
        }

        if (action) {
            filtered = filtered.filter((log) => log.action === action);
        }

        setFilteredLogs(filtered);
    };

    return (
        <Card
            title="Lịch sử hoạt động người dùng"
            extra={
                <Space>
                    <Button icon={<ReloadOutlined />} onClick={fetchLogs} loading={loading}>
                        Làm mới
                    </Button>
                </Space>
            }
        >
            <Space className="mb-4">
                <RangePicker
                    onChange={handleDateRangeChange}
                    format="DD/MM/YYYY"
                    placeholder={['Từ ngày', 'Đến ngày']}
                />
                <Select
                    placeholder="Lọc theo hành động"
                    allowClear
                    style={{ width: 200 }}
                    onChange={handleActionFilterChange}
                    options={[
                        { value: 'LOGIN', label: 'Đăng nhập' },
                        { value: 'LOGOUT', label: 'Đăng xuất' },
                        { value: 'CREATE_TEAM', label: 'Tạo nhóm' },
                        { value: 'UPDATE_PROFILE', label: 'Cập nhật thông tin' },
                        { value: 'Admin - Xem lịch sử tham gia', label: 'Admin - Xem lịch sử tham gia' },
                    ]}
                />
            </Space>

            <Table
                columns={columns}
                dataSource={filteredLogs}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng số ${total} bản ghi`,
                }}
                scroll={{ x: 1200 }}
            />
        </Card>
    );
};

export default UserLogs;
