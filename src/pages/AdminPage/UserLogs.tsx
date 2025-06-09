import React, { useState, useEffect } from 'react';
import { Table, Card, DatePicker, Select, Button, Input } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { getUserLogsApi } from '../../services/adminServices';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { ColumnsType } from 'antd/es/table';
import type { UserLog } from '../../services/types/types';
import { useMessage } from '@/hooks/useMessage';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Search } = Input;

const UserLogs = () => {
    const { message, contextHolder } = useMessage();
    const [logs, setLogs] = useState<UserLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<UserLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
    const [actionFilter, setActionFilter] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchLogs = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const response = await getUserLogsApi({
                page: page.toString(),
                limit: pageSize.toString(),
                fullName: searchText || undefined,
            });

            setLogs(response.logs);
            setFilteredLogs(response.logs);
            setPagination({
                current: response.page,
                pageSize: response.limit,
                total: response.total,
            });
        } catch (error) {
            message.error({ key: 'fetch-logs', content: 'Không thể tải lịch sử hoạt động' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs(pagination.current, pagination.pageSize);
    }, [searchText, dateRange, actionFilter]);

    useEffect(() => {
        let tempLogs = [...logs];

        if (actionFilter) {
            tempLogs = tempLogs.filter((log) => log.action === actionFilter);
        }

        if (dateRange) {
            tempLogs = tempLogs.filter((log) => {
                const logDate = dayjs(log.created_at);
                return logDate.isAfter(dateRange[0].startOf('day')) && logDate.isBefore(dateRange[1].endOf('day'));
            });
        }

        setFilteredLogs(tempLogs);
    }, [logs, actionFilter, dateRange]);

    const columns: ColumnsType<UserLog> = [
        {
            title: 'Thời gian',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm:ss'),
            sorter: (a: UserLog, b: UserLog) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
            width: 160,
            fixed: 'left',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a: UserLog, b: UserLog) => a.email.localeCompare(b.email),
            width: 200,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'full_name',
            key: 'full_name',
            sorter: (a: UserLog, b: UserLog) => a.full_name.localeCompare(b.full_name),
            width: 180,
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            width: 150,
            filters: [
                { text: 'Đăng nhập', value: 'LOGIN' },
                { text: 'Đăng xuất', value: 'LOGOUT' },
                { text: 'Tạo nhóm', value: 'CREATE_TEAM' },
                { text: 'Cập nhật thông tin', value: 'UPDATE_PROFILE' },
                { text: 'Admin - Xem lịch sử tham gia', value: 'Admin - Xem lịch sử tham gia' },
            ],
            onFilter: (value, record) => record.action === value,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            width: 250,
        },
        {
            title: 'Địa chỉ IP',
            dataIndex: 'ip_address',
            key: 'ip_address',
            width: 120,
            fixed: 'right',
        },
    ];

    const actionOptions = [
        { value: 'LOGIN', label: 'Đăng nhập' },
        { value: 'LOGOUT', label: 'Đăng xuất' },
        { value: 'CREATE_TEAM', label: 'Tạo nhóm' },
        { value: 'UPDATE_PROFILE', label: 'Cập nhật thông tin' },
        { value: 'Admin - Xem lịch sử tham gia', label: 'Admin - Xem lịch sử tham gia' },
    ];

    return (
        <Card
            title="Lịch sử hoạt động người dùng"
            extra={
                <Button
                    icon={<ReloadOutlined />}
                    onClick={() => fetchLogs(pagination.current, pagination.pageSize)}
                    loading={loading}
                >
                    Làm mới
                </Button>
            }
        >
            {contextHolder}
            <div className="flex flex-wrap md:flex-nowrap gap-3 mb-4">
                <div className="flex-1 min-w-[250px]">
                    <Search
                        placeholder="Tìm kiếm theo họ tên"
                        allowClear
                        enterButton={<SearchOutlined />}
                        onSearch={(value) => {
                            setSearchText(value);
                            setPagination((prev) => ({ ...prev, current: 1 }));
                        }}
                        style={{ width: '100%' }}
                    />
                </div>

                <div className="flex-1 min-w-[250px]">
                    <RangePicker
                        onChange={(dates) =>
                            dates && dates[0] && dates[1] ? setDateRange([dates[0], dates[1]]) : setDateRange(null)
                        }
                        format="DD/MM/YYYY"
                        placeholder={['Từ ngày', 'Đến ngày']}
                        style={{ width: '100%' }}
                    />
                </div>

                <div className="flex-1 min-w-[200px]">
                    <Select
                        placeholder="Lọc theo hành động"
                        allowClear
                        onChange={setActionFilter}
                        style={{ width: '100%' }}
                        options={actionOptions}
                    />
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={filteredLogs}
                rowKey="id"
                loading={loading}
                pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    position: ['bottomCenter'],
                }}
                onChange={(pagination) => fetchLogs(pagination.current, pagination.pageSize)}
                scroll={{ x: 1160 }}
            />
        </Card>
    );
};

export default UserLogs;
