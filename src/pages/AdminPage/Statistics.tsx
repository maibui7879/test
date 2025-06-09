import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Select, Space, Spin } from 'antd';
import { UserOutlined, TeamOutlined, TagsOutlined, CheckCircleOutlined } from '@ant-design/icons';
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

const Statistics = () => {
    const [statistics, setStatistics] = useState<GetStatisticsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState<StatisticsPeriod>('all');

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

    const sortMonthlyData = (data: any[]) => {
        return [...data].sort((a, b) => a.month.localeCompare(b.month));
    };

    const filterDataByYear = (data: any[]) => {
        return data.filter((item) => item.month.startsWith('2025'));
    };

    const calculateTotalFromMonthly = (data: any[], key: string) => {
        return data.reduce((acc, curr) => acc + (Number(curr[key]) || 0), 0);
    };

    const totalUsers =
        period === 'all'
            ? calculateTotalFromMonthly(filterDataByYear(statistics?.statistics.users.monthly || []), 'new_users')
            : statistics?.statistics.users.total || 0;

    const totalTasks =
        period === 'all'
            ? calculateTotalFromMonthly(
                  filterDataByYear(statistics?.statistics.tasks.personal.monthly || []),
                  'tasks',
              ) + calculateTotalFromMonthly(filterDataByYear(statistics?.statistics.tasks.team.monthly || []), 'tasks')
            : (statistics?.statistics.tasks.personal.total.tasks || 0) +
              (statistics?.statistics.tasks.team.total.tasks || 0);

    const totalCompleted =
        period === 'all'
            ? calculateTotalFromMonthly(
                  filterDataByYear(statistics?.statistics.completed_tasks.monthly || []),
                  'completed',
              )
            : statistics?.statistics.completed_tasks.total || 0;

    const taskTableData = [
        {
            key: 'personal',
            type: 'Công việc cá nhân',
            total:
                period === 'all'
                    ? calculateTotalFromMonthly(
                          filterDataByYear(statistics?.statistics.tasks.personal.monthly || []),
                          'tasks',
                      )
                    : statistics?.statistics.tasks.personal.total.tasks || 0,
            completed:
                period === 'all'
                    ? calculateTotalFromMonthly(
                          filterDataByYear(statistics?.statistics.tasks.personal.monthly || []),
                          'completed',
                      )
                    : statistics?.statistics.tasks.personal.total.completed || '0',
        },
        {
            key: 'team',
            type: 'Công việc nhóm',
            total:
                period === 'all'
                    ? calculateTotalFromMonthly(
                          filterDataByYear(statistics?.statistics.tasks.team.monthly || []),
                          'tasks',
                      )
                    : statistics?.statistics.tasks.team.total.tasks || 0,
            completed:
                period === 'all'
                    ? calculateTotalFromMonthly(
                          filterDataByYear(statistics?.statistics.tasks.team.monthly || []),
                          'completed',
                      )
                    : statistics?.statistics.tasks.team.total.completed || '0',
        },
    ];

    const userRegistrationData = {
        labels: statistics?.statistics.users.monthly
            ? sortMonthlyData(filterDataByYear(statistics.statistics.users.monthly)).map((detail) => detail.month)
            : [],
        datasets: [
            {
                label: 'Người dùng mới',
                data: statistics?.statistics.users.monthly
                    ? sortMonthlyData(filterDataByYear(statistics.statistics.users.monthly)).map(
                          (detail) => detail.new_users,
                      )
                    : [],
                borderColor: '#1890ff',
                backgroundColor: 'rgba(24, 144, 255, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const taskDistributionData = {
        labels: ['Cá nhân', 'Nhóm'],
        datasets: [
            {
                data: statistics
                    ? [statistics.statistics.tasks.personal.total.tasks, statistics.statistics.tasks.team.total.tasks]
                    : [],
                backgroundColor: ['#1890ff', '#52c41a'],
                borderWidth: 1,
            },
        ],
    };

    const completedTasksData = {
        labels: statistics?.statistics.completed_tasks.monthly
            ? sortMonthlyData(filterDataByYear(statistics.statistics.completed_tasks.monthly)).map(
                  (detail) => detail.month,
              )
            : [],
        datasets: [
            {
                label: 'Công việc hoàn thành',
                data: statistics?.statistics.completed_tasks.monthly
                    ? sortMonthlyData(filterDataByYear(statistics.statistics.completed_tasks.monthly)).map(
                          (detail) => detail.completed,
                      )
                    : [],
                borderColor: '#52c41a',
                backgroundColor: 'rgba(82, 196, 26, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
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
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    const taskTableColumns = [
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
        {
            title: 'Đã hoàn thành',
            dataIndex: 'completed',
            key: 'completed',
        },
    ];

    return (
        <div className="p-6">
            <div className="mb-4 flex justify-between items-center">
                <Space>
                    <Select value={period} onChange={setPeriod} style={{ width: 120 }}>
                        <Option value="all">Tất cả</Option>
                        <Option value="month">Tháng này</Option>
                        <Option value="year">Năm nay</Option>
                    </Select>
                </Space>
            </div>

            <Spin spinning={loading}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Statistic title="Tổng số người dùng" value={totalUsers} prefix={<UserOutlined />} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Statistic title="Tổng số công việc" value={totalTasks} prefix={<TagsOutlined />} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={8}>
                        <Card>
                            <Statistic
                                title="Công việc hoàn thành"
                                value={totalCompleted}
                                prefix={<CheckCircleOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} className="mt-4">
                    <Col xs={24} md={12}>
                        <Card title="Tăng trưởng người dùng theo tháng">
                            <div style={{ height: 300, width: '100%' }}>
                                <Line data={userRegistrationData} options={lineChartOptions} />
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card title="Công việc hoàn thành theo tháng">
                            <div style={{ height: 300, width: '100%' }}>
                                <Line data={completedTasksData} options={lineChartOptions} />
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} className="mt-4">
                    <Col xs={24}>
                        <Card title="Phân bố công việc">
                            <div style={{ height: 300, width: '100%' }}>
                                <Pie data={taskDistributionData} options={chartOptions} />
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Card title="Chi tiết công việc" className="mt-4">
                    <Table columns={taskTableColumns} dataSource={taskTableData} pagination={false} />
                </Card>
            </Spin>
        </div>
    );
};

export default Statistics;
