import apiRequest from '../common/apiRequest';
import { UserProfile } from '../types/types';

interface SearchUsersResponse {
    users: UserProfile[];
}

const searchUsers = async (searchTerm: string): Promise<UserProfile[]> => {
    try {
        const res = await apiRequest<SearchUsersResponse>(
            `/user/search?searchTerm=${encodeURIComponent(searchTerm)}`,
            'GET',
            null,
            true,
        );
        if (!res.success || !res.data) {
            throw new Error(res.message || 'Không thể tìm kiếm người dùng.');
        }
        return res.data.users;
    } catch (error) {
        console.error('Search users error:', error);
        throw new Error('Không tìm thấy người dùng phù hợp');
    }
};

export default searchUsers;
