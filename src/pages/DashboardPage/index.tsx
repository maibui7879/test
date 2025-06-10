import React, { useEffect, useState, useCallback } from 'react';
import { Card, Row, Col, Statistic, Progress, Select } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, BarChartOutlined } from '@ant-design/icons';
import { getMemberStatistics } from '@/services/statisticsServices';
import { useMessage } from '@/hooks/useMessage';
import { StatisticsResponse } from '@services/types/types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
    const [stats, setStats] = useState<StatisticsResponse | null>(null);
    const [period, setPeriod] = useState<string>('month');
    const { message } = useMessage();

    const fetchStats = useCallback(async () => {
        try {
            const data = await getMemberStatistics(period);
            setStats(data);
        } catch (error: any) {
            message.error({
                key: 'fetch-stats-error',
                content: error.message || 'Không thể tải thống kê',
            });
        }
    }, [period, message]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (!stats) return null;

    const taskStatusData = {
        labels: ['Chưa thực hiện', 'Đang thực hiện', 'Hoàn thành'],
        datasets: [
            {
                data: [
                    parseInt(stats.period_stats.task_completion.todo),
                    parseInt(stats.period_stats.task_completion.in_progress),
                    parseInt(stats.period_stats.task_completion.completed),
                ],
                backgroundColor: ['#1890ff', '#faad14', '#3f8600'],
                borderWidth: 1,
            },
        ],
    };

    const taskDistributionData = {
        labels: ['Cá nhân', 'Nhóm'],
        datasets: [
            {
                data: [
                    parseInt(stats.period_stats.task_distribution.personal.count),
                    parseInt(stats.period_stats.task_distribution.team.count),
                ],
                backgroundColor: ['#722ed1', '#13c2c2'],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y' as const,
        plugins: {
            legend: {
                display: false,
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
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {
                    display: false,
                },
            },
        },
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    font: {
                        size: 12,
                    },
                    padding: 20,
                },
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
        <div className="space-y-6 ">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Thống kê công việc</h1>
                <Select
                    value={period}
                    onChange={setPeriod}
                    options={[
                        { value: 'week', label: 'Tuần này' },
                        { value: 'month', label: 'Tháng này' },
                        { value: 'year', label: 'Năm nay' },
                    ]}
                    className="w-40"
                />
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <Card className="h-full">
                        <Statistic
                            title="Tổng nhiệm vụ"
                            value={stats.period_stats.total_tasks}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="h-full">
                        <Statistic
                            title="Đang thực hiện"
                            value={stats.period_stats.task_completion.in_progress}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="h-full">
                        <Statistic
                            title="Hoàn thành"
                            value={stats.period_stats.task_completion.completed}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="h-full">
                        <Statistic
                            title="Tỷ lệ hoàn thành"
                            value={stats.period_stats.task_completion.completion_rate}
                            prefix={<BarChartOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card title="Trạng thái nhiệm vụ" className="h-full">
                        <div className="h-64">
                            <Bar data={taskStatusData} options={chartOptions} />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Phân bố nhiệm vụ" className="h-full">
                        <div className="h-64">
                            <Pie data={taskDistributionData} options={pieOptions} />
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card title="Phân bố nhiệm vụ" className="h-full">
                        <Progress
                            percent={parseFloat(stats.period_stats.task_distribution.personal.percentage)}
                            status="active"
                            strokeColor={{
                                '0%': '#722ed1',
                                '100%': '#13c2c2',
                            }}
                        />
                        <div className="mt-4 text-sm text-gray-500">
                            <div className="flex justify-between items-center">
                                <span>Cá nhân:</span>
                                <span className="font-medium">
                                    {stats.period_stats.task_distribution.personal.count} tasks
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span>Nhóm:</span>
                                <span className="font-medium">
                                    {stats.period_stats.task_distribution.team.count} tasks
                                </span>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
