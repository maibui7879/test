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
        name: 'TRANG CHỦ',
        component: Dashboard,
        icon: FaClipboard,
        children: [],
    },
    {
        path: '/team',
        name: 'ĐỘI NHÓM',
        component: Team,
        icon: FaUsers,
        children: [],
    },
    {
        path: '/task',
        name: 'CÔNG VIỆC',
        icon: FaTasks,
        children: [
            {
                path: 'calendar',
                name: 'Lịch cá nhân',
                component: Calendar,
                icon: FaCalendarAlt,
            },
            {
                path: 'task',
                name: 'Công việc cá nhân',
                component: PersonalTask,
                icon: FaTasks,
            },
        ],
    },
    {
        path: '/user',
        icon: FaUser,
        name: 'HỒ SƠ',
        children: [
            {
                path: 'profile',
                name: 'Hồ sơ',
                component: Profile,
                icon: FaUser,
            },
        ],
    },
];
export const privateRoutes: Route[] = [];
