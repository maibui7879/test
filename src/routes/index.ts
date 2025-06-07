import { AuthForm } from '@pages/Auth';
import Dashboard from '@pages/DashboardPage';
import PersonalTask from '@pages/PersonalTask';
import Profile from '@pages/Profile';
import Route from './type';
import {
    faClipboard,
    faTasks,
    faUser,
    faUsers,
    faBell,
    faUserShield,
    faChartBar,
    faHistory,
} from '@fortawesome/free-solid-svg-icons';
import CalenderPerson from '@pages/PersonalTask/calendar';
import CreatedTeamsPage from '@pages/TeamPage/CreatedTeamsPage';
import JoinedTeamsPage from '@pages/TeamPage/JoinedTeamsPage';
import TeamDetail from '@pages/TeamPage/TeamDetail';
import ReminderPage from '@pages/Reminder';
import AdminPage from '@pages/AdminPage';
import UserManagement from '@pages/AdminPage/UserManagement';
import Statistics from '@pages/AdminPage/Statistics';
import UserLogs from '@pages/AdminPage/UserLogs';

export const publicRoutes: Route[] = [
    {
        path: '/',
        component: AuthForm,
        layout: null,
    },
];

export const sidebarRoutes: Route[] = [
    {
        path: '/dashboard',
        name: 'Tổng quan',
        component: Dashboard,
        icon: faClipboard,
        children: [],
    },
    {
        path: '/teams',
        name: 'Nhóm của bạn',
        icon: faUsers,
        children: [
            {
                path: 'created',
                name: 'Nhóm của bạn',
                component: CreatedTeamsPage,
            },
            {
                path: 'joined',
                name: 'Nhóm tham gia',
                component: JoinedTeamsPage,
            },
        ],
    },
    {
        path: '/personal-task',
        name: 'Công việc cá nhân',
        icon: faTasks,
        children: [
            {
                path: 'calendar',
                name: 'Lịch cá nhân',
                component: CalenderPerson,
            },
            {
                path: 'task',
                name: 'Công việc của bạn',
                component: PersonalTask,
            },
        ],
    },
    {
        path: '/reminder',
        name: 'Nhắc nhở',
        icon: faBell,
        component: ReminderPage,
    },
    {
        path: '/user',
        icon: faUser,
        name: 'Trang cá nhân',
        component: Profile,
    },
];

export const adminSidebarRoutes: Route[] = [
    // {
    //     path: '/admin',
    //     name: 'Quản trị hệ thống',
    //     icon: faUserShield,
    //     component: AdminPage,
    // },
    {
        path: '/admin',
        name: 'Thống kê',
        icon: faChartBar,
        component: Statistics,
    },
    {
        path: '/admin/users',
        name: 'Quản lý người dùng',
        icon: faUser,
        component: UserManagement,
    },
    {
        path: '/admin/logs',
        name: 'Lịch sử hoạt động',
        icon: faHistory,
        component: UserLogs,
    },
];

export const privateRoutes: Route[] = [
    {
        path: '/teams',
        children: [
            {
                path: 'created/:teamId',
                component: TeamDetail,
            },
            {
                path: 'joined/:teamId',
                component: TeamDetail,
            },
        ],
    },
];
