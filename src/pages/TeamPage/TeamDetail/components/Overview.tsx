import React, { useEffect, useState, useCallback } from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import {
    UserOutlined,
    FileTextOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CommentOutlined,
    BarChartOutlined,
    LineChartOutlined,
} from '@ant-design/icons';
import { getTeamStatistics } from '@/services/teamServices';
import { useMessage } from '@/hooks/useMessage';
import { TeamStatistics } from '@services/teamServices/getTeamStatistics';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface OverviewProps {
    teamId: string | undefined;
    onStatsChange?: (stats: TeamStatistics) => void;
}

const useTeamStatistics = (teamId: string | undefined) => {
    const [teamStats, setTeamStats] = useState<TeamStatistics | null>(null);
    const { message } = useMessage();

    const fetchTeamStats = useCallback(async () => {
        if (!teamId) return;

        try {
            const stats = await getTeamStatistics(Number(teamId));
            setTeamStats(stats);
            return stats;
        } catch (error: any) {
            message.error({
                key: 'fetch-stats-error',
                content: error.message || 'Không thể tải thống kê nhóm',
            });
            return null;
        }
    }, [teamId, message]);

    useEffect(() => {
        fetchTeamStats();
    }, [fetchTeamStats]);

    return { teamStats, fetchTeamStats };
};

const Overview = ({ teamId, onStatsChange }: OverviewProps) => {
    const { teamStats, fetchTeamStats } = useTeamStatistics(teamId);

    useEffect(() => {
        if (teamStats && onStatsChange) {
            onStatsChange(teamStats);
        }
    }, [teamStats, onStatsChange]);

    if (!teamStats) return null;

    // Data for task status pie chart
    const taskStatusData = {
        labels: ['Todo', 'In Progress', 'Completed'],
        datasets: [
            {
                data: [teamStats.todo_tasks, teamStats.in_progress_tasks, teamStats.completed_tasks],
                backgroundColor: ['#1890ff', '#faad14', '#3f8600'],
                borderWidth: 1,
            },
        ],
    };

    // Data for priority pie chart
    const priorityData = {
        labels: ['High', 'Medium', 'Low'],
        datasets: [
            {
                data: [teamStats.high_priority_tasks, teamStats.medium_priority_tasks, teamStats.low_priority_tasks],
                backgroundColor: ['#ff4d4f', '#faad14', '#52c41a'],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <div className="space-y-6">
            {/* Basic Statistics */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic title="Thành viên" value={teamStats.total_members} prefix={<UserOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Tổng nhiệm vụ"
                            value={teamStats.total_tasks}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Nhiệm vụ đang thực hiện"
                            value={teamStats.in_progress_tasks}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Nhiệm vụ hoàn thành"
                            value={teamStats.completed_tasks}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Charts Row */}
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card title="Trạng thái nhiệm vụ">
                        <div className="h-64">
                            <Pie data={taskStatusData} options={chartOptions} />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Độ ưu tiên nhiệm vụ">
                        <div className="h-64">
                            <Pie data={priorityData} options={chartOptions} />
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Interaction Statistics */}
            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Card>
                        <Statistic
                            title="Tổng số bình luận"
                            value={teamStats.total_comments}
                            prefix={<CommentOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card>
                        <Statistic
                            title="Bình quân bình luận/task"
                            value={teamStats.avg_comments_per_task}
                            prefix={<BarChartOutlined />}
                            precision={2}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card>
                        <Statistic
                            title="Nhiệm vụ trong 7 ngày"
                            value={teamStats.recent_tasks}
                            prefix={<LineChartOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Progress Indicators */}
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card title="Tỷ lệ hoàn thành">
                        <Progress
                            percent={parseFloat(teamStats.completion_rate)}
                            status="active"
                            strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                            }}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Tỷ lệ phân công">
                        <Progress
                            percent={parseFloat(teamStats.assignment_rate)}
                            status="active"
                            strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                            }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Overview;
