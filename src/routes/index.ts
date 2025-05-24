import AuthForm from '../pages/Auth/components/AuthForm';
import DefaultLayout from '../layouts/DefaultLayout';
import AuthLayout from '../layouts/AuthLayout';
import Route from './type';

const publicRoutes: Route[] = [
    {
        path: '/auth',
        component: AuthForm,
        layout: AuthLayout, 
    },
];

const privateRoutes: Route[] = [

];

export { publicRoutes, privateRoutes };
