import { fireEvent, render, screen } from '@testing-library/react';
import DataTable from './DataTable';

describe('DataTable', () => {
    it('should render a line break after the table', () => {
        render(<DataTable />);

        const tableElement = screen.getByRole('table');
        const hrElement = tableElement.nextSibling;

        expect(hrElement && (hrElement as HTMLElement).tagName).toBe('HR');
    });

    it('should render a dropdown with default value "Show 5" and correct options', () => {
        render(<DataTable />);

        const dropdownElement = screen.getByRole('combobox');

        expect(dropdownElement).toBeInTheDocument();
        expect((dropdownElement as HTMLSelectElement).value).toBe('5');
        expect(
            screen.getByRole('option', { name: 'Show 5' })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('option', { name: 'Show 10' })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('option', { name: 'Show 20' })
        ).toBeInTheDocument();
    });

    it('should render a disabled "Prev" button to the right of the dropdown', () => {
        render(<DataTable />);

        const prevButton = screen.getByRole('button', { name: 'Prev' });

        expect(prevButton).toBeInTheDocument();
        expect(prevButton).toBeDisabled();
    });

    it('should render page information text with variables for current and total pages', () => {
        render(<DataTable />);

        const pageInfo = screen.getByText('Page 1 of 8');

        expect(pageInfo).toBeInTheDocument();
    });

    it('should render a "Next" button to the right of the page information text', () => {
        render(<DataTable />);

        const nextButton = screen.getByRole('button', { name: 'Next' });

        expect(nextButton).toBeInTheDocument();
        expect(nextButton).toBeEnabled();
    });

    it('should render the correct number of rows when dropdown value is 5', () => {
        render(<DataTable />);

        const rowElements = screen.getAllByRole('row');
        // 1 header row + 5 data rows
        expect(rowElements).toHaveLength(6);
    });

    it('should render the correct number of rows when dropdown value is 10', () => {
        render(<DataTable />);

        const dropdownElement = screen.getByRole('combobox');
        dropdownElement.dispatchEvent(new Event('change', { bubbles: true }));
        (dropdownElement as HTMLSelectElement).value = '10';
        dropdownElement.dispatchEvent(new Event('change', { bubbles: true }));

        const rowElements = screen.getAllByRole('row');
        // 1 header row + 10 data rows
        expect(rowElements).toHaveLength(11);
    });

    it('should render the correct number of rows when dropdown value is 20', () => {
        render(<DataTable />);

        const dropdownElement = screen.getByRole('combobox');
        dropdownElement.dispatchEvent(new Event('change', { bubbles: true }));
        (dropdownElement as HTMLSelectElement).value = '20';
        dropdownElement.dispatchEvent(new Event('change', { bubbles: true }));

        const rowElements = screen.getAllByRole('row');
        // 1 header row + 20 data rows
        expect(rowElements).toHaveLength(21);
    });

    it('should update the total number of pages when dropdown value changes', () => {
        render(<DataTable />);

        const dropdownElement = screen.getByRole('combobox');
        // Default is 5 rows per page, 36 users, so 8 pages
        expect(screen.getByText('Page 1 of 8')).toBeInTheDocument();

        (dropdownElement as HTMLSelectElement).value = '10';
        dropdownElement.dispatchEvent(new Event('change', { bubbles: true }));
        // 10 rows per page, 36 users, so 4 pages
        expect(screen.getByText('Page 1 of 4')).toBeInTheDocument();

        (dropdownElement as HTMLSelectElement).value = '20';
        dropdownElement.dispatchEvent(new Event('change', { bubbles: true }));
        // 20 rows per page, 36 users, so 2 pages
        expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    });

    it('should show all users and only one page if users are fewer than rowsToShow', () => {
        const fewUsers = [
            { id: 1, name: 'A', age: 20, occupation: 'X' },
            { id: 2, name: 'B', age: 21, occupation: 'Y' },
            { id: 3, name: 'C', age: 22, occupation: 'Z' },
        ];
        render(<DataTable users={fewUsers} />);
        const rowElements = screen.getAllByRole('row');
        // 1 header row + 3 data rows
        expect(rowElements).toHaveLength(4);
        expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
    });

    it('should reset to page 1 when dropdown value changes', () => {
        render(<DataTable />);

        // Simulate going to page 2 (if implemented in the future)
        // For now, just change dropdown and check page resets to 1
        const dropdownElement = screen.getByRole('combobox');
        (dropdownElement as HTMLSelectElement).value = '10';
        dropdownElement.dispatchEvent(new Event('change', { bubbles: true }));

        expect(screen.getByText('Page 1 of 4')).toBeInTheDocument();
    });

    it('should go to the next page and update displayed users when Next is clicked', () => {
        render(<DataTable />);

        const nextButton = screen.getByRole('button', { name: 'Next' });
        const firstRowBefore = screen.getAllByRole('row')[1];
        const firstCellBefore = firstRowBefore.querySelector('td');
        expect(firstCellBefore).toHaveTextContent('1');

        fireEvent.click(nextButton);

        const firstRowAfter = screen.getAllByRole('row')[1];
        const firstCellAfter = firstRowAfter.querySelector('td');
        expect(firstCellAfter).toHaveTextContent('6');
    });

    it('should go to the previous page and update displayed users when Prev is clicked', () => {
        render(<DataTable />);

        const nextButton = screen.getByRole('button', { name: 'Next' });
        nextButton.click();

        const prevButton = screen.getByRole('button', { name: 'Prev' });
        prevButton.click();

        const firstRow = screen.getAllByRole('row')[1];
        expect(firstRow).toHaveTextContent('1');
    });

    it('should disable Prev button on the first page and Next button on the last page', () => {
        render(<DataTable />);

        const prevButton = screen.getByRole('button', { name: 'Prev' });
        const nextButton = screen.getByRole('button', { name: 'Next' });

        expect(prevButton).toBeDisabled();
        expect(nextButton).toBeEnabled();

        // Go to last page
        for (let i = 1; i < 8; i++) {
            fireEvent.click(nextButton);
        }
        expect(nextButton).toBeDisabled();
        expect(prevButton).toBeEnabled();
    });

    it('should disable both Prev and Next buttons if users array is empty', () => {
        render(<DataTable users={[]} />);

        const prevButton = screen.getByRole('button', { name: 'Prev' });
        const nextButton = screen.getByRole('button', { name: 'Next' });

        expect(prevButton).toBeDisabled();
        expect(nextButton).toBeDisabled();
        expect(screen.queryAllByRole('row')).toHaveLength(1); // Only header
    });

    it('should disable both Prev and Next buttons if users are fewer than rowsToShow', () => {
        const fewUsers = [
            { id: 1, name: 'A', age: 20, occupation: 'X' },
            { id: 2, name: 'B', age: 21, occupation: 'Y' },
        ];
        render(<DataTable users={fewUsers} />);

        const prevButton = screen.getByRole('button', { name: 'Prev' });
        const nextButton = screen.getByRole('button', { name: 'Next' });

        expect(prevButton).toBeDisabled();
        expect(nextButton).toBeDisabled();
    });
});
