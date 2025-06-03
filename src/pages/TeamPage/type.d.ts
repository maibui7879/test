export interface TeamState {
    teams: Team[];
    loading: boolean;
    error: string | null;
    total: number;
    page: number;
    hasMore: boolean;
    fetchedPages: number[];
}
