import { ComponentType, ReactNode } from 'react';
import { IconType } from 'react-icons';

export default interface Route {
    path: string;
    name?: string; 
    component?: ComponentType<any>;
    layout?: ComponentType<{ children: ReactNode }> | null;
    children?: Route[];
    icon?: IconType;
}
