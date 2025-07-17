import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
    it('renders children correctly', () => {
        render(<Button>Click me</Button>);

        expect(screen.getByTestId('button')).toHaveTextContent('Click me');
    });

    it('calls onClick when clicked', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        fireEvent.click(screen.getByTestId('button'));

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies correct variant styles', () => {
        render(<Button variant="secondary">Secondary</Button>);

        const button = screen.getByTestId('button');
        expect(button).toHaveClass('bg-gray-200', 'text-gray-800');
    });

    it('disables button when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);

        expect(screen.getByTestId('button')).toBeDisabled();
    });
});
