import { fireEvent, render, screen } from '@testing-library/react';
import LoadMoreButton from './LoadMoreButton';

describe('LoadMoreButton', () => {
    it('renders the button with correct text', () => {
        render(<LoadMoreButton />);

        expect(
            screen.getByRole('button', { name: 'Load more jobs' })
        ).toBeInTheDocument();
    });

    it('calls the onClick handler when clicked', () => {
        const handleClick = jest.fn();
        render(<LoadMoreButton onClick={handleClick} />);

        const button = screen.getByRole('button', { name: 'Load more jobs' });
        fireEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
