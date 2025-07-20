import { User } from './DataTable';
import { getTotalPages, getUsersToDisplay } from './DataTable.service';

describe('DataTable.service.tsx', () => {
    const users: User[] = [
        { id: 1, name: 'Alice', age: 30, occupation: 'Engineer' },
        { id: 2, name: 'Bob', age: 25, occupation: 'Designer' },
        { id: 3, name: 'Charlie', age: 28, occupation: 'Teacher' },
        { id: 4, name: 'David', age: 35, occupation: 'Manager' },
        { id: 5, name: 'Eve', age: 22, occupation: 'Student' },
        { id: 6, name: 'Frank', age: 40, occupation: 'Doctor' },
    ];

    describe('getTotalPages', () => {
        it('should return correct total pages for normal case', () => {
            expect(getTotalPages(users, 5)).toBe(2);
            expect(getTotalPages(users, 2)).toBe(3);
        });

        it('should return 1 if users array is empty', () => {
            expect(getTotalPages([], 5)).toBe(1);
        });

        it('should handle rowsToShow greater than user count', () => {
            expect(getTotalPages(users, 10)).toBe(1);
        });

        it('should treat zero or negative rowsToShow as 1', () => {
            expect(getTotalPages(users, 0)).toBe(6);
            expect(getTotalPages(users, -3)).toBe(6);
        });
    });

    describe('getUsersToDisplay', () => {
        it('should return correct slice for page 1 and 5 rows', () => {
            expect(getUsersToDisplay(users, 5, 1)).toEqual(users.slice(0, 5));
        });

        it('should return correct slice for page 2 and 5 rows', () => {
            expect(getUsersToDisplay(users, 5, 2)).toEqual(users.slice(5, 10));
        });

        it('should handle fewer users than rowsToShow', () => {
            expect(getUsersToDisplay(users.slice(0, 3), 5, 1)).toEqual(
                users.slice(0, 3)
            );
        });

        it('should handle exact multiples of rowsToShow', () => {
            expect(getUsersToDisplay(users.slice(0, 4), 2, 2)).toEqual(
                users.slice(2, 4)
            );
        });

        it('should handle empty users array', () => {
            expect(getUsersToDisplay([], 5, 1)).toEqual([]);
        });

        it('should treat negative or zero rowsToShow as 1', () => {
            expect(getUsersToDisplay(users, 0, 1)).toEqual(users.slice(0, 1));
            expect(getUsersToDisplay(users, -2, 1)).toEqual(users.slice(0, 1));
        });

        it('should handle out-of-bounds page numbers (too high)', () => {
            expect(getUsersToDisplay(users, 5, 10)).toEqual(users.slice(5, 10));
        });

        it('should handle out-of-bounds page numbers (too low)', () => {
            expect(getUsersToDisplay(users, 5, -3)).toEqual(users.slice(0, 5));
        });
    });
});
