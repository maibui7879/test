import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ComponentType, ReactNode } from 'react';

export interface Route {
    path: string;
    name?: string;
    component?: ComponentType<any>;
    layout?: ComponentType<{ children: ReactNode }> | null;
    children?: Route[];
    icon?: IconDefinition;
}
