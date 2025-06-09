import React, { useEffect, useState, useMemo } from 'react';
import { Card, Row, Col, Statistic, Table, Spin } from 'antd';
import { getMemberStatistics } from '@services/teamServices';
import { useMessage } from '@hooks/useMessage';
import { MemberStatistics as MemberStatisticsData } from '@services/types/types';

const STATUS_MAP = {
    todo: 'Chưa bắt đầu',
    in_progress: 'Đang thực hiện',
    done: 'Hoàn thành',
} as const;

const PRIORITY_MAP = {
    low: 'Thấp',
    medium: 'Trung bình',
    high: 'Cao',
} as const;

interface MemberStatisticsProps {
    teamId: number;
    userId: number;
    onClose?: () => void;
}

const StatisticCard = ({ title, value, suffix }: { title: string; value: number; suffix?: string }) => (
    <Card>
        <Statistic title={title} value={value} suffix={suffix} />
    </Card>
);

const PercentCard = ({ title, value }: { title: string; value: number }) => (
    <Card title={title}>
        <Statistic value={value} precision={1} suffix="%" />
    </Card>
);

const HourCard = ({ title, value }: { title: string; value: number }) => (
    <Card title={title}>
        <Statistic value={value} precision={1} suffix="giờ" />
    </Card>
);

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

    const columns = useMemo(
        () => [
            { title: 'Tên công việc', dataIndex: 'title', key: 'title' },
            {
                title: 'Trạng thái',
                dataIndex: 'status',
                key: 'status',
                render: (status: string) => STATUS_MAP[status as keyof typeof STATUS_MAP] || status,
            },
            {
                title: 'Ưu tiên',
                dataIndex: 'priority',
                key: 'priority',
                render: (priority: string) => PRIORITY_MAP[priority as keyof typeof PRIORITY_MAP] || priority,
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
        ],
        [],
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    if (!statistics) return null;

    const { user_info, task_statistics, active_tasks, performance_metrics } = statistics;

    return (
        <div className="space-y-6">
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
                    <StatisticCard title="Tổng công việc đã tạo" value={task_statistics.total_created_tasks} />
                </Col>
                <Col span={6}>
                    <StatisticCard title="Công việc đã phân công" value={task_statistics.assigned_tasks} />
                </Col>
                <Col span={6}>
                    <PercentCard title="Hoàn thành" value={parseFloat(task_statistics.completed_tasks) || 0} />
                </Col>
                <Col span={6}>
                    <PercentCard title="Đang thực hiện" value={parseFloat(task_statistics.pending_tasks) || 0} />
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={8}>
                    <PercentCard title="Tỷ lệ hoàn thành" value={parseFloat(task_statistics.completion_rate) || 0} />
                </Col>
                <Col span={8}>
                    <PercentCard
                        title="Tỷ lệ ưu tiên cao"
                        value={parseFloat(task_statistics.high_priority_rate) || 0}
                    />
                </Col>
                <Col span={8}>
                    <StatisticCard title="Điểm hoạt động" value={parseFloat(task_statistics.activity_score)} />
                </Col>
            </Row>

            <Card title="Công việc đang thực hiện">
                <Table dataSource={active_tasks} rowKey="id" pagination={false} columns={columns} />
            </Card>

            <Row gutter={16}>
                <Col span={8}>
                    <HourCard title="Thời gian trung bình" value={performance_metrics.avg_completion_time} />
                </Col>
                <Col span={8}>
                    <HourCard title="Nhanh nhất" value={performance_metrics.min_completion_time} />
                </Col>
                <Col span={8}>
                    <HourCard title="Lâu nhất" value={performance_metrics.max_completion_time} />
                </Col>
            </Row>
        </div>
    );
}

export default MemberStatistics;
