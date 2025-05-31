import { AuthForm } from '@pages/Auth';
import Dashboard from '@pages/Dashboard';
import Team from '@pages/Team';
import Calendar from '@pages/Calendar';
import PersonalTask from '@pages/PersonalTask';
import Profile from '@pages/Profile';
import Route from './type';
import { FaCalendarAlt, FaClipboard, FaTasks, FaUser, FaUsers } from 'react-icons/fa';

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
        icon: FaClipboard,
        children: [],
    },
    {
        path: '/team',
        name: 'Nhóm của bạn',
        component: Team,
        icon: FaUsers,
        children: [],
    },
    {
        path: '/nhiem-vu-ca-nhan',
        name: 'Công việc cá nhân',
        icon: FaTasks,
        children: [
            {
                path: 'lich',
                name: 'Lịch cá nhân',
                component: Calendar,
                icon: FaCalendarAlt,
            },
            {
                path: 'nhiem-vu',
                name: 'Công việc của bạn',
                component: PersonalTask,
                icon: FaTasks,
            },
        ],
    },
    {
        path: '/user',
        icon: FaUser,
        name: 'Trang cá nhân',
        component: Profile,
    },
];
export const privateRoutes: Route[] = [];
