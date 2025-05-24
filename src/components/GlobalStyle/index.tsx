import React, { ReactNode } from 'react';
import './GlobalStyle.css';

interface GlobalStyleProps {
    children: ReactNode;
}

function GlobalStyle({ children }: GlobalStyleProps) {
    return <>{children}</>;
}

export default GlobalStyle;
