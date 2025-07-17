import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
    it('renders the job board title', () => {
        render(<App />);

        expect(screen.getByText('Hacker News Jobs Board')).toBeInTheDocument();
    });

    it('renders 6 job cards', () => {
        render(<App />);

        const cards = screen.getAllByTestId('job-card');
        expect(cards.length).toBe(6);
    });

    it('renders the load more button', () => {
        render(<App />);

        expect(
            screen.getByRole('button', { name: 'Load more jobs' })
        ).toBeInTheDocument();
    });
});
