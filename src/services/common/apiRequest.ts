interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
}

async function apiRequest<T = any>(
    endpoint: string,
    method: string = 'GET',
    body: any = null,
    requiresAuth: boolean = true,
): Promise<ApiResponse<T>> {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (requiresAuth) {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                return { success: false, message: 'Bạn cần đăng nhập để thực hiện thao tác này.' };
            }
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options: RequestInit = {
            method,
            headers,
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const baseUrl = process.env.BASE_URL || '';
        const response = await fetch(`${baseUrl}${endpoint}`, options);
        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || data.error || 'Đã xảy ra lỗi không xác định.',
            };
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        console.error('API Request Error:', error);
        return {
            success: false,
            message: 'Không thể kết nối đến server.',
        };
    }
}

export default apiRequest;
