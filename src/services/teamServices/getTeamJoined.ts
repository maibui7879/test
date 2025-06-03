import apiRequest, { ApiResponse } from '../common/apiRequest';
import { GetTeamsResponseData } from '../types/types';

const getTeamsJoined = async (page: number = 1, limit: number = 10): Promise<ApiResponse<GetTeamsResponseData>> => {
    const res = await apiRequest<GetTeamsResponseData>(`/teams/joined?page=${page}&limit=${limit}`, 'GET', null, true);
    if (!res.success) {
        throw new Error(res.message || 'Không thể lấy danh sách team đang tham gia');
    }
    return res;
};

export default getTeamsJoined;
