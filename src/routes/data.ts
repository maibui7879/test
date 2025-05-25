import { FaCalendarAlt, FaUsers, FaUser, FaTasks, FaClipboard } from 'react-icons/fa';
import AuthForm from '../pages/Auth/components/AuthForm';
import Calendar from '../pages/Calendar';
import Team from '../pages/Team';
import Profile from '../pages/Profile';
import PersonalTask from '../pages/PersonalTask';
import Dashboard from '../pages/Dashboard';

export const publicRoutes = [
  { path: '/auth', component: AuthForm, layout: null },
];

export const privateRoutes = [
    {
        path: '/',
        name:"TRANG CHỦ",
        component: Dashboard,
        icon: FaClipboard,
        children: [
        ],
    },
    { 
        path: '/team', 
        name:'ĐỘI NHÓM',
        component: Team, 
        icon: FaUsers,
        children: [
        ],
    },
    {
        path: '/task',
        name: "CÔNG VIỆC",
        icon: FaTasks, 
        children: [
        { 
            path: 'calendar', 
            name: "Lịch cá nhân",
            component: Calendar, 
            icon: FaCalendarAlt 
        },
        { 
            path: 'task', 
            name: "Công việc cá nhân",
            component: PersonalTask, 
            icon: FaTasks 
        },
    ],
    },
    {
        path: '/user',
        icon: FaUser,
        name:'HỒ SƠ',
        children: [
        { path: 'profile', name:"Hồ sơ", component: Profile, icon: FaUser },
        ],
    },


];
