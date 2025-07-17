import { render, screen } from '@testing-library/react';
import JobCard from './JobCard';

describe('JobCard', () => {
    const props = {
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
});
