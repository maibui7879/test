import apiRequest, { ApiResponse } from '../common/apiRequest';
import { GetTeamsResponseData } from '../types/types';

const getCreatedTeams = async (
    page: number = 1,
    limit: number = 10,
    title?: string,
): Promise<ApiResponse<GetTeamsResponseData>> => {
    let url = `/teams/created?page=${page}&limit=${limit}`;
    if (title) {
        url += `&title=${encodeURIComponent(title)}`;
    }

    const res = await apiRequest<GetTeamsResponseData>(url, 'GET', null, true);
    if (!res.success) {
        throw new Error(res.message || 'Không thể lấy danh sách team đã tạo');
    }
    return res;
};

export default getCreatedTeams;
