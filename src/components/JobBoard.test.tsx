import { render, screen } from '@testing-library/react';
import JobBoard from './JobBoard';

describe('JobBoard', () => {
    it('renders the board title', () => {
        render(<JobBoard />);

        expect(screen.getByText(/hacker news jobs board/i)).toBeInTheDocument();
    });

    it('renders 6 job cards', () => {
        render(<JobBoard />);

        const cards = screen.getAllByTestId('job-card');
        expect(cards.length).toBe(6);
    });

    it('renders the load more button', () => {
        render(<JobBoard />);

        expect(
            screen.getByRole('button', { name: 'Load more jobs' })
        ).toBeInTheDocument();
    });

    it('renders job card data', () => {
        render(<JobBoard />);

        expect(screen.getByText(/firezone.*elixir.*rust/i)).toBeInTheDocument();
        expect(
            screen.getByText(/aptible.*security engineer/i)
        ).toBeInTheDocument();
    });
});
