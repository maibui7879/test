import DefaultLayout from '../layouts/DefaultLayout';
import { publicRoutes as publicData, privateRoutes as privateData } from './data';

export const publicRoutes = publicData.map((route) => ({
    ...route,
    layout: route.layout === null ? null : DefaultLayout,
}));

export const privateRoutes = privateData.map((route) => ({
    ...route,
    layout: DefaultLayout,
}));
