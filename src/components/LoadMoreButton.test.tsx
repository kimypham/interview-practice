import { render, screen } from '@testing-library/react';
import LoadMoreButton from './LoadMoreButton';

describe('LoadMoreButton', () => {
    it('renders the button with correct text', () => {
        render(<LoadMoreButton />);

        expect(
            screen.getByRole('button', { name: 'Load more jobs' })
        ).toBeInTheDocument();
    });
});
