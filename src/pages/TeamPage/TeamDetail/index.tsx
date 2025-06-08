import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { Tabs, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Overview from './components/Overview';
import Tasks from './components/Tasks';
import Members from './components/Members';
import Settings from './components/Settings';
import TeamCalendar from './components/Calendar';

const TeamDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { teamId } = useParams();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [overviewTabChange, setOverviewTabChange] = useState(false);

    const getTeamType = () => {
        const pathParts = location.pathname.split('/');
        const typeIndex = pathParts.indexOf('teams') + 1;
        return pathParts[typeIndex] || 'created';
    };

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['overview', 'tasks', 'members', 'settings', 'calendar'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleTabChange = (key: string) => {
        setActiveTab(key);
        const teamType = getTeamType();
        navigate(`/teams/${teamType}/${teamId}?tab=${key}`, { replace: true });

        // Set overviewTabChange to true when switching to overview tab
        if (key === 'overview') {
            setOverviewTabChange(true);
        }
    };

    useEffect(() => {
        if (overviewTabChange) {
            setOverviewTabChange(false);
        }
    }, [overviewTabChange]);

    return (
        <div className="p-2 md:p-6">
            <div className="mb-6">
                <Button icon={<ArrowLeftOutlined />} onClick={handleBack} className="flex items-center">
                    Quay lại
                </Button>
            </div>

            <div>
                <Tabs
                    activeKey={activeTab}
                    onChange={handleTabChange}
                    className="team-detail-tabs !text-[13px]"
                    items={[
                        {
                            key: 'overview',
                            label: 'Tổng quan',
                            children: <Overview teamId={teamId} onTabChange={overviewTabChange} />,
                        },
                        {
                            key: 'tasks',
                            label: 'Nhiệm vụ',
                            children: <Tasks teamId={teamId} />,
                        },
                        {
                            key: 'calendar',
                            label: 'Lịch',
                            children: <TeamCalendar teamId={teamId} />,
                        },
                        {
                            key: 'members',
                            label: 'Thành viên',
                            children: <Members teamId={teamId} />,
                        },
                        {
                            key: 'settings',
                            label: 'Cài đặt',
                            children: <Settings teamId={teamId} />,
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export default TeamDetail;
