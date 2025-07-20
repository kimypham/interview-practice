import { User } from './DataTable';

export function getTotalPages(users: User[], rowsToShow: number): number {
    const safeRowsToShow: number = Math.max(1, rowsToShow);
    const totalUsers: number = users.length;
    return Math.max(1, Math.ceil(totalUsers / safeRowsToShow));
}

export function getUsersToDisplay(
    users: User[],
    rowsToShow: number,
    currentPage: number
): User[] {
    const safeRowsToShow: number = Math.max(1, rowsToShow);
    const totalPages: number = Math.max(
        1,
        Math.ceil(users.length / safeRowsToShow)
    );
    const safeCurrentPage: number = Math.max(
        1,
        Math.min(currentPage, totalPages)
    );
    const startIndex: number = (safeCurrentPage - 1) * safeRowsToShow;
    const endIndex: number = startIndex + safeRowsToShow;
    return users.slice(startIndex, endIndex);
}
