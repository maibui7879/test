import React, { ReactNode } from 'react';
import classNames from 'classnames/bind';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './DefaultLayout.module.scss';

const cx = classNames.bind(styles);

interface DefaultLayoutProps {
    children: ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                {/* <Sidebar /> */}
                <div className={cx('content')}>{children}</div>
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
