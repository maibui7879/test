import { AuthForm } from '@pages/Auth';
import Dashboard from '@pages/Dashboard';
import PersonalTask from '@pages/PersonalTask';
import Profile from '@pages/Profile';
import Route from './type';
import { faCalendarAlt, faClipboard, faTasks, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import CalenderPerson from '@pages/PersonalTask/calendar';
import CreatedTeamsPage from '@pages/TeamPage/CreatedTeamsPage';
import JoinedTeamsPage from '@pages/TeamPage/JoinedTeamsPage';

export const publicRoutes: Route[] = [
    {
        path: '/auth',
        component: AuthForm,
        layout: null,
    },
];

export const sidebarRoutes: Route[] = [
    {
        path: '/',
        name: 'DashBoard',
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
                icon: faUsers,
            },
            {
                path: 'joined',
                name: 'Nhóm tham gia',
                component: JoinedTeamsPage,
                icon: faUsers,
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
                icon: faCalendarAlt,
            },
            {
                path: 'task',
                name: 'Công việc của bạn',
                component: PersonalTask,
                icon: faTasks,
            },
        ],
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
                path: ':id',
                component: AuthForm,
                layout: null,
            },
            {
                path: 'tasks',
                component: PersonalTask,
                layout: null,
            },
        ],
    },
];
