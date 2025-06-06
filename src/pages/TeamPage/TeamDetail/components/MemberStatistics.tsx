import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Spin } from 'antd';
import { getMemberStatistics } from '@services/teamServices';
import { useMessage } from '@hooks/useMessage';
import { MemberStatistics as MemberStatisticsData } from '@services/types/types';

interface MemberStatisticsProps {
    teamId: number;
    userId: number;
    onClose?: () => void;
}

function MemberStatistics({ teamId, userId, onClose }: MemberStatisticsProps) {
    const [loading, setLoading] = useState(true);
    const [statistics, setStatistics] = useState<MemberStatisticsData | null>(null);
    const { message, contextHolder } = useMessage();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getMemberStatistics(teamId, userId);
                if (response.success && response.data) {
                    setStatistics(response.data);
                }
            } catch {
                message.error({
                    key: 'member-stats-error',
                    content: 'Không thể lấy thống kê thành viên',
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [message, teamId, userId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    if (!statistics) return null;

    const { user_info, task_statistics, active_tasks, performance_metrics } = statistics;

    const renderPercent = (value: number) => <Statistic value={value} precision={1} suffix="%" />;

    const renderHour = (value: number) => <Statistic value={value} precision={1} suffix="giờ" />;

    return (
        <div className="p-6 space-y-6">
            {contextHolder}

            <div>
                <h2 className="text-2xl font-bold mb-2">Thống kê thành viên: {user_info.full_name}</h2>
                <p className="text-gray-600">Vai trò: {user_info.role}</p>
                <p className="text-gray-600">
                    Tham gia từ: {new Date(user_info.joined_at).toLocaleDateString('vi-VN')}
                </p>
            </div>

            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic title="Tổng công việc đã tạo" value={task_statistics.total_created_tasks} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Công việc đã phân công" value={task_statistics.assigned_tasks} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="Hoàn thành">{renderPercent(Number(task_statistics.completed_tasks))}</Card>
                </Col>
                <Col span={6}>
                    <Card title="Đang thực hiện">{renderPercent(Number(task_statistics.pending_tasks))}</Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={8}>
                    <Card title="Tỷ lệ hoàn thành">{renderPercent(Number(task_statistics.completion_rate))}</Card>
                </Col>
                <Col span={8}>
                    <Card title="Tỷ lệ ưu tiên cao">{renderPercent(Number(task_statistics.high_priority_rate))}</Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="Điểm hoạt động" value={task_statistics.activity_score} />
                    </Card>
                </Col>
            </Row>

            <Card title="Công việc đang thực hiện">
                <Table
                    dataSource={active_tasks}
                    rowKey="id"
                    pagination={false}
                    columns={[
                        { title: 'Tên công việc', dataIndex: 'title', key: 'title' },
                        {
                            title: 'Trạng thái',
                            dataIndex: 'status',
                            key: 'status',
                            render: (status: string) =>
                                ({
                                    todo: 'Chưa bắt đầu',
                                    in_progress: 'Đang thực hiện',
                                    done: 'Hoàn thành',
                                })[status] || status,
                        },
                        {
                            title: 'Ưu tiên',
                            dataIndex: 'priority',
                            key: 'priority',
                            render: (priority: string) =>
                                ({
                                    low: 'Thấp',
                                    medium: 'Trung bình',
                                    high: 'Cao',
                                })[priority] || priority,
                        },
                        {
                            title: 'Hạn chót',
                            dataIndex: 'end_time',
                            key: 'end_time',
                            render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
                        },
                        {
                            title: 'Còn lại',
                            dataIndex: 'days_remaining',
                            key: 'days_remaining',
                            render: (days: number) => `${days} ngày`,
                        },
                        { title: 'Bình luận', dataIndex: 'comment_count', key: 'comment_count' },
                        { title: 'Ghi chú', dataIndex: 'note_count', key: 'note_count' },
                    ]}
                />
            </Card>

            <Row gutter={16}>
                <Col span={8}>
                    <Card title="Thời gian trung bình">{renderHour(performance_metrics.avg_completion_time)}</Card>
                </Col>
                <Col span={8}>
                    <Card title="Nhanh nhất">{renderHour(performance_metrics.min_completion_time)}</Card>
                </Col>
                <Col span={8}>
                    <Card title="Lâu nhất">{renderHour(performance_metrics.max_completion_time)}</Card>
                </Col>
            </Row>
        </div>
    );
}

export default MemberStatistics;
