import Home from '../pages/HomePage';
import Route from './type';

const publicRoutes: Route[] = [
    {
        path: 'home',
        component: Home,
    },
];

const privateRoutes: Route[] = [];

export { publicRoutes, privateRoutes };
