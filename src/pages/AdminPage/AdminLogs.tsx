import React, { useState, useEffect } from 'react';
import { Table, Card, DatePicker, Select, Space, Tag, Typography, message } from 'antd';
import type { AdminLog } from '../../services/adminServices/getAdminLogs';
import dayjs from 'dayjs';
import getAdminLogsApi from '../../services/adminServices/getAdminLogs';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const AdminLogs = () => {
    const [logs, setLogs] = useState<AdminLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [filters, setFilters] = useState({
        actionType: undefined as string | undefined,
        startDate: undefined as string | undefined,
        endDate: undefined as string | undefined,
    });

    const fetchLogs = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const response = await getAdminLogsApi({
                page: page.toString(),
                limit: pageSize.toString(),
                actionType: filters.actionType,
                startDate: filters.startDate,
                endDate: filters.endDate,
            });

            setLogs(response.logs);
            setPagination({
                current: response.page,
                pageSize: response.limit,
                total: response.total,
            });
        } catch (error: any) {
            message.error(error.message || 'Không thể tải danh sách log');
            setLogs([]);
            setPagination({
                current: 1,
                pageSize: 10,
                total: 0,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs(pagination.current, pagination.pageSize);
    }, [filters]);

    const handleTableChange = (pagination: any) => {
        fetchLogs(pagination.current, pagination.pageSize);
    };

    const handleDateRangeChange = (dates: any) => {
        if (dates) {
            setFilters({
                ...filters,
                startDate: dates[0]?.toISOString(),
                endDate: dates[1]?.toISOString(),
            });
        } else {
            setFilters({
                ...filters,
                startDate: undefined,
                endDate: undefined,
            });
        }
    };

    const handleActionTypeChange = (value: string) => {
        setFilters({
            ...filters,
            actionType: value,
        });
    };

    const getActionTypeColor = (type: string) => {
        switch (type) {
            case 'create':
                return 'green';
            case 'update':
                return 'blue';
            case 'delete':
                return 'red';
            case 'view':
                return 'purple';
            default:
                return 'default';
        }
    };

    const columns = [
        {
            title: 'Thời gian',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm:ss'),
            sorter: (a: AdminLog, b: AdminLog) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        },
        {
            title: 'Admin',
            dataIndex: 'admin_name',
            key: 'admin_name',
            render: (_: string, record: AdminLog) => (
                <div>
                    <div>{record.admin_name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{record.admin_email}</div>
                </div>
            ),
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            render: (action: string, record: AdminLog) => (
                <Space direction="vertical" size="small">
                    <Tag color={getActionTypeColor(record.action_type)}>{record.action}</Tag>
                    <div style={{ fontSize: '12px', color: '#666' }}>{record.description}</div>
                </Space>
            ),
        },
        {
            title: 'Thay đổi',
            dataIndex: 'changes',
            key: 'changes',
            render: (_: any, record: AdminLog) => {
                if (!record.old_data && !record.new_data) return null;

                return (
                    <div style={{ fontSize: '12px' }}>
                        {record.old_data && (
                            <div style={{ color: '#ff4d4f' }}>
                                <strong>Cũ:</strong> {JSON.stringify(record.old_data)}
                            </div>
                        )}
                        {record.new_data && (
                            <div style={{ color: '#52c41a' }}>
                                <strong>Mới:</strong> {JSON.stringify(record.new_data)}
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            title: 'IP',
            dataIndex: 'ip_address',
            key: 'ip_address',
        },
    ];

    return (
        <div className="p-6">
            <Card>
                <Title level={4}>Lịch sử hoạt động Admin</Title>
                <Space style={{ marginBottom: 16 }}>
                    <RangePicker onChange={handleDateRangeChange} showTime format="DD/MM/YYYY HH:mm:ss" />
                    <Select
                        style={{ width: 120 }}
                        placeholder="Loại hành động"
                        allowClear
                        onChange={handleActionTypeChange}
                    >
                        <Select.Option value="create">Tạo mới</Select.Option>
                        <Select.Option value="update">Cập nhật</Select.Option>
                        <Select.Option value="delete">Xóa</Select.Option>
                        <Select.Option value="view">Xem</Select.Option>
                    </Select>
                </Space>

                <Table
                    columns={columns}
                    dataSource={logs}
                    rowKey="id"
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng số ${total} bản ghi`,
                    }}
                    loading={loading}
                    onChange={handleTableChange}
                />
            </Card>
        </div>
    );
};

export default AdminLogs;
