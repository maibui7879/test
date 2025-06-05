export interface LoginResponse {
    token: string;
}
//=============================
export interface UserProfile {
    id?: number;
    email?: string;
    role?: string;
    status?: string;
    full_name?: string;
    phone_number?: string;
    avatar_url?: string;
    gender?: string;
    date_of_birth?: string | null;
    address?: string | null;
    bio?: string | null;
}

export interface UpdateUserProfile {
    full_name?: string;
    phone_number?: string;
    avatar: string | File;
    gender?: string;
    date_of_birth?: string | null;
    address?: string | null;
    bio?: string | null;
}
//===========================
export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}
//=========================
export interface TaskPayload {
    id?: string;
    title: string;
    team_id?: string | null;
    start_time: string;
    end_time: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    assigned_user_id?: string | number | null;
    creator_name?: string;
    created_at?: string;
}

// ====================

export interface TaskNote {
    id: number;
    task_id: number;
    user_id: number;
    content: string;
    created_at: string;
    updated_at: string;
    full_name: string;
}

export interface TaskAttachment {
    id: number;
    task_id: number;
    user_id: number;
    file_url: string;
    file_name: string;
    file_type: string;
    file_size: number;
    created_at: string;
    updated_at: string;
    full_name: string;
}

export interface TaskNotesAndAttachments {
    id: number;
    task_id: number;
    user_id: number;
    content?: string;
    file_url?: string;
    file_name?: string;
    file_type?: string;
    file_size?: number;
    created_at: string;
    updated_at: string;
    full_name: string;
}

//===========================
export interface TaskComment {
    id: number;
    task_id: number;
    user_id: number; // ID người comment
    full_name: string;
    comment: string; // Nội dung comment
    is_from_assignee: boolean; // Có phải từ người được giao task không
    created_at: string;
}
//==================================
export interface CreateTeamPayload {
    name: string;
    description?: string;
}
export interface UpdateTeamPayload {
    name?: string;
    description?: string;
    avatar_url?: File | null;
}
export interface Team {
    id: number;
    name: string;
    description: string;
    avatar_url: string | null;
    created_at: string;
    creator_name: string;
}
export interface GetTeamsResponseData {
    data: Team[];
    pagination: {
        currentPage: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// ======================
export interface UpdateAssignmentPayload {
    taskId: number;
    userId: number;
}
export interface TaskAssignment {
    id: number;
    task_id: number;
    user_id: number | null;
    assigned_by: number | null;
    assigned_at: string;
    updated_at: string;
}
//============================
export interface Reminder {
    id: number;
    user_id: number;
    task_id: number;
    start_time?: string;
    end_time?: string;
    mes?: string;
    is_sent?: boolean;
    is_read?: boolean;
    created_at?: string;
}

export interface TeamTasksResponse {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    tasksTeam: TaskPayload[];
}
