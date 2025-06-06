export const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'high':
            return 'red';
        case 'medium':
            return 'orange';
        case 'low':
            return 'green';
        default:
            return 'blue';
    }
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
    switch (status) {
        case 'todo':
            return 'default';
        case 'in_progress':
            return 'processing';
        case 'done':
            return 'success';
        default:
            return 'default';
    }
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
    switch (role) {
        case 'creator':
            return 'purple';
        case 'admin':
            return 'blue';
        case 'member':
            return 'green';
        default:
            return 'default';
    }
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
