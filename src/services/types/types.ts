export interface LoginResponse {
    token: string;
}
//=============================
export interface UserProfile {
    id: number;
    email: string;
    role: string;
    status: string;
    full_name: string;
    phone_number?: string | null;
    avatar_url: string | null;
    gender: string;
    date_of_birth: string | null;
    address?: string | null;
    bio: string | null;
}
//===========================
export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}
//=========================
export interface TaskPayload {
    title: string;
    team_id?: number | null;
    start_time: string;
    end_time: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
}

// ====================
export interface TaskNote {
    id: number;
    task_id: number;
    user_id: number;
    content: string;
    created_at: string;
    updated_at: string;
}

export interface TaskAttachment {
    id: number;
    task_id: number;
    file_url: string;
    file_name: string;
    file_type?: string | null;
    file_size?: number | null;
    uploaded_by?: number | null;
    created_at: string;
}

export interface TaskNotesAndAttachments {
    notes: TaskNote[];
    attachments?: TaskAttachment[];
}
//===========================
export interface TaskComment {
    id: number;
    task_id: number;
    user_id: number; // ID người comment
    comment: string; // Nội dung comment
    is_from_assignee: boolean; // Có phải từ người được giao task không
    created_at: string;
}
