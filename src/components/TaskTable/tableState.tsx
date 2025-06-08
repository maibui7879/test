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

export const getPriorityColor = (priority: string) => {
    return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS.default;
};

export const getPriorityText = (priority: string) => {
    switch (priority) {
        case 'high':
            return 'Cao';
        case 'medium':
            return 'Trung bình';
        case 'low':
            return 'Thấp';
        default:
            return priority;
    }
};

export const getStatusColor = (status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.default;
};

export const getStatusText = (status: string) => {
    switch (status) {
        case 'todo':
            return 'Chưa thực hiện';
        case 'in_progress':
            return 'Đang thực hiện';
        case 'done':
            return 'Hoàn thành';
        default:
            return status;
    }
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
