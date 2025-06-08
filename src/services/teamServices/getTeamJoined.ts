import apiRequest, { ApiResponse } from '../common/apiRequest';
import { GetTeamsResponseData } from '../types/types';

const getTeamsJoined = async (
    page: number = 1,
    limit: number = 10,
    title?: string,
): Promise<ApiResponse<GetTeamsResponseData>> => {
    let url = `/teams/joined?page=${page}&limit=${limit}`;
    if (title) {
        url += `&title=${encodeURIComponent(title)}`;
    }

    const res = await apiRequest<GetTeamsResponseData>(url, 'GET', null, true);
    if (!res.success) {
        throw new Error(res.message || 'Không thể lấy danh sách team đang tham gia');
    }
    return res;
};

export default getTeamsJoined;
