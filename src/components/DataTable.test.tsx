import { render, screen } from '@testing-library/react';
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
});
