import { useState } from 'react';
import { users as defaultUsers } from '../data/users';
import { getTotalPages, getUsersToDisplay } from './DataTable.service';

export type User = {
    id: number;
    name: string;
    age: number;
    occupation: string;
};

export type DataTableProps = {
    users?: User[];
};

export default function DataTable({ users = defaultUsers }: DataTableProps) {
    // State for dropdown (number of rows to show)
    const [rowsToShow, setRowsToShow] = useState<number>(5);
    // State for current page
    const [currentPage, setCurrentPage] = useState<number>(1);

    const totalPages: number = getTotalPages(users, rowsToShow);
    const usersToDisplay: User[] = getUsersToDisplay(
        users,
        rowsToShow,
        currentPage
    );

    const handleRowsToShowChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newRowsToShow: number = Number(event.target.value);
        setRowsToShow(newRowsToShow);
        setCurrentPage(1); // Reset to first page when rows per page changes
    };

    const handlePrevPage = (): void => {
        setCurrentPage((prevPage: number) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = (): void => {
        setCurrentPage((prevPage: number) =>
            Math.min(prevPage + 1, totalPages)
        );
    };

    const isPrevDisabled: boolean =
        currentPage === 1 || users.length === 0 || users.length <= rowsToShow;
    const isNextDisabled: boolean =
        currentPage === totalPages ||
        users.length === 0 ||
        users.length <= rowsToShow;

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Data Table</h1>
            <table className="min-w-full border-separate border-spacing-y-2">
                <thead>
                    <tr>
                        {[
                            { label: 'ID', key: 'id' },
                            { label: 'Name', key: 'name' },
                            { label: 'Age', key: 'age' },
                            { label: 'Occupation', key: 'occupation' },
                        ].map(({ label, key }) => (
                            <th
                                key={key}
                                className="text-left font-bold px-2 py-1"
                            >
                                {label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {usersToDisplay.map(({ id, name, age, occupation }) => (
                        <tr key={id} className="border-b last:border-b-0">
                            <td className="px-2 py-1">{id}</td>
                            <td className="px-2 py-1">{name}</td>
                            <td className="px-2 py-1">{age}</td>
                            <td className="px-2 py-1">{occupation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr className="my-4" />
            <div className="flex items-center gap-4">
                <select
                    className="border rounded px-2 py-1 mr-2"
                    value={rowsToShow}
                    onChange={handleRowsToShowChange}
                    aria-label="Show rows"
                >
                    <option value={5}>Show 5</option>
                    <option value={10}>Show 10</option>
                    <option value={20}>Show 20</option>
                </select>
                <button
                    className="border rounded px-4 py-1 bg-white hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-500"
                    onClick={handlePrevPage}
                    disabled={isPrevDisabled}
                >
                    Prev
                </button>
                <span className="mx-2">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="border rounded px-4 py-1 bg-white hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-500"
                    onClick={handleNextPage}
                    disabled={isNextDisabled}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
