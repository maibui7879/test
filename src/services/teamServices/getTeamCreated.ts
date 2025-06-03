import apiRequest, { ApiResponse } from '../common/apiRequest';
import { GetTeamsResponseData } from '../types/types';

const getCreatedTeams = async (page: number = 1, limit: number = 10): Promise<ApiResponse<GetTeamsResponseData>> => {
    const res = await apiRequest<GetTeamsResponseData>(`/teams/created?page=${page}&limit=${limit}`, 'GET', null, true);
    if (!res.success) {
        throw new Error(res.message || 'Không thể lấy danh sách team đã tạo');
    }
    return res;
};

export default getCreatedTeams;
