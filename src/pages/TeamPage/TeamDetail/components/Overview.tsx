import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { TeamOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

interface OverviewProps {
    teamId: string | undefined;
}

const Overview = ({ teamId }: OverviewProps) => {
    const [teamStats, setTeamStats] = useState({
        totalMembers: 0,
        completedTasks: 0,
        pendingTasks: 0,
        progress: 0,
    });

    useEffect(() => {
        // TODO: Fetch team statistics
        // This is mock data for now
        setTeamStats({
            totalMembers: 5,
            completedTasks: 12,
            pendingTasks: 3,
            progress: 75,
        });
    }, [teamId]);

    return (
        <div className="space-y-6">
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic title="Thành viên" value={teamStats.totalMembers} prefix={<TeamOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Nhiệm vụ hoàn thành"
                            value={teamStats.completedTasks}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Nhiệm vụ đang thực hiện"
                            value={teamStats.pendingTasks}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Tiến độ"
                            value={teamStats.progress}
                            suffix="%"
                            valueStyle={{ color: '#1890ff' }}
                        />
                        <Progress percent={teamStats.progress} size="small" />
                    </Card>
                </Col>
            </Row>

            <Card title="Thông tin nhóm">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold">Mô tả</h3>
                        <p className="text-gray-600">
                            Đây là mô tả về nhóm của bạn. Bạn có thể thêm thông tin chi tiết về mục tiêu và hoạt động
                            của nhóm ở đây.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Mục tiêu</h3>
                        <ul className="list-disc list-inside text-gray-600">
                            <li>Mục tiêu 1</li>
                            <li>Mục tiêu 2</li>
                            <li>Mục tiêu 3</li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Overview;
