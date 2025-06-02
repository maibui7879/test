import React, { ComponentType, ReactNode } from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export default interface Route {
    path: string;
    name?: string;
    component?: ComponentType<any>;
    layout?: ComponentType<{ children: ReactNode }> | null;
    children?: Route[];
    icon?: IconDefinition;
}
