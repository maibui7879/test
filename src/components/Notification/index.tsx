import React from 'react';
import { message } from 'antd';

interface NotificationProps {
    key: string;
    type: 'loading' | 'success' | 'error' | 'info' | 'warning';
    content: string;
    duration?: number;
}

export const useNotification = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const show = ({ key, type, content, duration = 2 }: NotificationProps) => {
        messageApi.open({
            key,
            type,
            content,
            duration,
        });
    };

    const loading = (key: string, content: string) => {
        show({ key, type: 'loading', content });
    };

    const success = (key: string, content: string, duration?: number) => {
        show({ key, type: 'success', content, duration });
    };

    const error = (key: string, content: string, duration?: number) => {
        show({ key, type: 'error', content, duration });
    };

    const info = (key: string, content: string, duration?: number) => {
        show({ key, type: 'info', content, duration });
    };

    const warning = (key: string, content: string, duration?: number) => {
        show({ key, type: 'warning', content, duration });
    };

    return {
        contextHolder,
        loading,
        success,
        error,
        info,
        warning,
    };
};

export default useNotification;
