import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Select, Space, Spin } from 'antd';
import { UserOutlined, TeamOutlined, TagsOutlined } from '@ant-design/icons';
import { getStatisticsApi } from '../../services/adminServices';
import type { GetStatisticsResponse, StatisticsPeriod } from '../../services/adminServices/getStatistics';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    LineElement,
    PointElement,
} from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, LineElement, PointElement);

const { Option } = Select;

const Statistics: React.FC = () => {
    const [statistics, setStatistics] = useState<GetStatisticsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState<StatisticsPeriod>('week');

    const fetchStatistics = async (selectedPeriod: StatisticsPeriod) => {
        setLoading(true);
        try {
            const response = await getStatisticsApi({ period: selectedPeriod });
            setStatistics(response);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics(period);
    }, [period]);

    const handlePeriodChange = (value: StatisticsPeriod) => {
        setPeriod(value);
    };

    const userRegistrationData = {
        labels: statistics?.statistics.user_registration.details.map((detail) => detail.period) || [],
        datasets: [
            {
                label: 'Người dùng mới',
                data: statistics?.statistics.user_registration.details.map((detail) => detail.new_users) || [],
                borderColor: '#1890ff',
                backgroundColor: 'rgba(24, 144, 255, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const taskDistributionData = {
        labels: ['Cá nhân', 'Nhóm'],
        datasets: [
            {
                data: statistics
                    ? [statistics.statistics.tasks.personal.total, statistics.statistics.tasks.team.total]
                    : [],
                backgroundColor: ['#1890ff', '#52c41a'],
                borderWidth: 1,
            },
        ],
    };

    const teamGrowthData = {
        labels: statistics?.statistics.teams.details.map((detail) => detail.period) || [],
        datasets: [
            {
                label: 'Nhóm mới',
                data: statistics?.statistics.teams.details.map((detail) => detail.new_teams) || [],
                borderColor: '#722ed1',
                backgroundColor: 'rgba(114, 46, 209, 0.1)',
                tension: 0.4,
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

    const lineChartOptions = {
        ...chartOptions,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <div className="mb-4 flex justify-between items-center">
                <Space>
                    <Select value={period} onChange={handlePeriodChange} style={{ width: 120 }}>
                        <Option value="week">Tuần này</Option>
                        <Option value="month">Tháng này</Option>
                        <Option value="year">Năm nay</Option>
                    </Select>
                </Space>
            </div>

            <Spin spinning={loading}>
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Tổng số người dùng"
                                value={statistics?.statistics.user_registration.total || 0}
                                prefix={<UserOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Tổng số công việc"
                                value={
                                    (statistics?.statistics.tasks.personal.total || 0) +
                                    (statistics?.statistics.tasks.team.total || 0)
                                }
                                prefix={<TagsOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Tổng số nhóm"
                                value={statistics?.statistics.teams.total || 0}
                                prefix={<TeamOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} className="mt-4">
                    <Col span={12}>
                        <Card title="Tăng trưởng người dùng">
                            <div className="h-64">
                                <Line data={userRegistrationData} options={lineChartOptions} />
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Tăng trưởng nhóm">
                            <div className="h-64">
                                <Line data={teamGrowthData} options={lineChartOptions} />
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} className="mt-4">
                    <Col span={24}>
                        <Card title="Phân bố công việc">
                            <div className="h-64">
                                <Pie data={taskDistributionData} options={chartOptions} />
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Card title="Chi tiết công việc" className="mt-4">
                    <Table
                        columns={[
                            {
                                title: 'Loại',
                                dataIndex: 'type',
                                key: 'type',
                            },
                            {
                                title: 'Tổng số',
                                dataIndex: 'total',
                                key: 'total',
                            },
                        ]}
                        dataSource={[
                            {
                                key: 'personal',
                                type: 'Công việc cá nhân',
                                total: statistics?.statistics.tasks.personal.total || 0,
                            },
                            {
                                key: 'team',
                                type: 'Công việc nhóm',
                                total: statistics?.statistics.tasks.team.total || 0,
                            },
                        ]}
                        pagination={false}
                    />
                </Card>
            </Spin>
        </div>
    );
};

export default Statistics;
