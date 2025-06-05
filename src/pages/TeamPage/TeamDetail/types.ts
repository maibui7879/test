import { TeamStatistics } from '@services/teamServices/getTeamStatistics';

export interface TeamDetailProps {
    teamId: string | undefined;
}

export interface OverviewProps extends TeamDetailProps {
    teamStats: TeamStatistics | null;
}

export interface TasksProps extends TeamDetailProps {
    onTaskChange?: () => void;
}

export interface MembersProps extends TeamDetailProps {
    onMemberChange?: () => void;
}

export interface SettingsProps extends TeamDetailProps {
    onSettingsChange?: () => void;
}
