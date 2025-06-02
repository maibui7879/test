import { useMemo } from 'react';
import { message } from 'antd';

type MessageType = 'success' | 'error' | 'info' | 'warning' | 'loading';

interface MessageOptions {
    key: string;
    content: string;
    duration?: number;
}

export const useMessage = () => {
    const [api, contextHolder] = message.useMessage();

    const messageApi = useMemo(() => {
        const open = (type: MessageType, options: MessageOptions) => {
            api.open({
                key: options.key,
                type,
                content: options.content,
                duration: options.duration ?? (type === 'loading' ? 0 : 3),
            });
        };

        return {
            success: (options: MessageOptions) => open('success', options),
            error: (options: MessageOptions) => open('error', options),
            info: (options: MessageOptions) => open('info', options),
            warning: (options: MessageOptions) => open('warning', options),
            loading: (options: MessageOptions) => open('loading', options),
        };
    }, [api]);

    return { message: messageApi, contextHolder };
};
