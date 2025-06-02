import { AuthForm } from '@pages/Auth';
import Dashboard from '@pages/Dashboard';
import PersonalTask from '@pages/PersonalTask';
import Profile from '@pages/Profile';
import Route from './type';
import { faCalendarAlt, faClipboard, faTasks, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import TeamPage from '@pages/TeamPage';
import CalenderPerson from '@pages/PersonalTask/calendar';

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
        path: '/team',
        name: 'Nhóm của bạn',
        component: TeamPage,
        icon: faUsers,
        children: [],
    },
    {
        path: '/nhiem-vu-ca-nhan',
        name: 'Công việc cá nhân',
        icon: faTasks,
        children: [
            {
                path: 'lich',
                name: 'Lịch cá nhân',
                component: CalenderPerson,
                icon: faCalendarAlt,
            },
            {
                path: 'nhiem-vu',
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
export const privateRoutes: Route[] = [];
