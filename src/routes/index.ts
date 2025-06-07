import { AuthForm } from '@pages/Auth';
import Dashboard from '@pages/Dashboard';
import PersonalTask from '@pages/PersonalTask';
import Profile from '@pages/Profile';
import Route from './type';
import { faClipboard, faTasks, faUser, faUsers, faBell } from '@fortawesome/free-solid-svg-icons';
import CalenderPerson from '@pages/PersonalTask/calendar';
import CreatedTeamsPage from '@pages/TeamPage/CreatedTeamsPage';
import JoinedTeamsPage from '@pages/TeamPage/JoinedTeamsPage';
import TeamDetail from '@pages/TeamPage/TeamDetail';
import ReminderPage from '@pages/Reminder';

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
