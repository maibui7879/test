export const EVENT_COLORS = {
    done: '#059669',
    in_progress: '#2563EB',
    high: '#DC2626',
    medium: '#D97706',
    low: '#059669',
    default: '#4B5563',
} as const;

export const STATUS_COLORS = {
    todo: 'default',
    in_progress: 'processing',
    done: 'success',
    default: 'default',
} as const;

export const PRIORITY_COLORS = {
    high: 'error',
    medium: 'warning',
    low: 'success',
    default: 'default',
} as const;

export const ROLE_COLORS = {
    creator: 'purple',
    admin: 'blue',
    member: 'green',
    default: 'default',
} as const;

export const STATUS_TAGS = {
    todo: { color: 'default', text: 'Chưa thực hiện' },
    in_progress: { color: 'processing', text: 'Đang thực hiện' },
    done: { color: 'success', text: 'Hoàn thành' },
} as const;

export const PRIORITY_TAGS = {
    low: { color: 'success', text: 'Thấp' },
    medium: { color: 'warning', text: 'Trung bình' },
    high: { color: 'error', text: 'Cao' },
} as const;

export const getPriorityColor = (priority: string) => {
    return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS.default;
};

export const getPriorityText = (priority: string) => {
    return PRIORITY_TAGS[priority as keyof typeof PRIORITY_TAGS]?.text || priority;
};

export const getStatusColor = (status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.default;
};

export const getStatusText = (status: string) => {
    return STATUS_TAGS[status as keyof typeof STATUS_TAGS]?.text || status;
};

export const getRoleColor = (role: string | undefined) => {
    if (!role) return ROLE_COLORS.default;
    return ROLE_COLORS[role as keyof typeof ROLE_COLORS] || ROLE_COLORS.default;
};

export const getRoleText = (role: string | undefined) => {
    switch (role) {
        case 'creator':
            return 'Người tạo';
        case 'admin':
            return 'Quản trị viên';
        case 'member':
            return 'Thành viên';
        default:
            return role || 'Không xác định';
    }
};

export const getEventColor = (status: string, priority: string) => {
    if (status === 'done') return EVENT_COLORS.done;
    if (status === 'in_progress') return EVENT_COLORS.in_progress;
    if (priority === 'high') return EVENT_COLORS.high;
    if (priority === 'medium') return EVENT_COLORS.medium;
    return EVENT_COLORS.default;
};
