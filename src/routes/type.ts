import { ComponentType, ReactNode } from 'react';

export default interface Route {
    path: string;
    component?: ComponentType<any>;
    layout?: ComponentType<{ children: ReactNode }> | null;
    children?: Route[];
}
