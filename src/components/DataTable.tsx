import { useState } from 'react';
import { users } from '../data/users';

export default function DataTable() {
    // State for dropdown (number of rows to show)
    const [rowsToShow, setRowsToShow] = useState<number>(5);
    // State for current page (static for now)
    const currentPage: number = 1;
    const totalPages: number = 8;

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
                    {users
                        .slice(currentPage - 1, rowsToShow)
                        .map(({ id, name, age, occupation }) => (
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
                    onChange={() => {}}
                    aria-label="Show rows"
                >
                    <option value={5}>Show 5</option>
                    <option value={10}>Show 10</option>
                    <option value={20}>Show 20</option>
                </select>
                <button
                    className="border rounded px-4 py-1 bg-gray-200 text-gray-500 cursor-not-allowed"
                    disabled
                >
                    Prev
                </button>
                <span className="mx-2">
                    Page {currentPage} of {totalPages}
                </span>
                <button className="border rounded px-4 py-1 bg-white hover:bg-gray-100">
                    Next
                </button>
            </div>
        </div>
    );
}
