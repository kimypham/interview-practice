import { fireEvent, render, screen } from '@testing-library/react';
import JobCard from './JobCard';

describe('JobCard', () => {
    const props: { title: string; poster: string; date: string; url?: string } =
        {
            title: 'Test Job Title',
            poster: 'testposter',
            date: '1/1/2023, 12:00:00 PM',
        };

    it('renders the title, poster, and date', () => {
        render(<JobCard {...props} />);
        expect(screen.getByText(props.title)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(props.poster))).toBeInTheDocument();
        expect(screen.getByText(new RegExp(props.date))).toBeInTheDocument();
    });

    it('is clickable (has role button)', () => {
        render(<JobCard {...props} />);
        const card = screen.getByRole('button');
        expect(card).toBeInTheDocument();
    });

    it('opens url in new tab when clicked if url is provided', () => {
        const url: string = 'https://example.com/job';
        const openSpy = jest.spyOn(window, 'open').mockImplementation();
        render(<JobCard {...props} url={url} />);
        const card = screen.getByRole('button');
        fireEvent.click(card);
        expect(openSpy).toHaveBeenCalledWith(
            url,
            '_blank',
            'noopener,noreferrer'
        );
        openSpy.mockRestore();
    });

    it('does not open url if not provided', () => {
        const openSpy = jest.spyOn(window, 'open').mockImplementation();
        render(<JobCard {...props} />);
        const card = screen.getByRole('button');
        fireEvent.click(card);
        expect(openSpy).not.toHaveBeenCalled();
        openSpy.mockRestore();
    });
});
