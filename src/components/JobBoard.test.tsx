import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JobBoard from './JobBoard';
import * as JobBoardService from './JobBoard.service';

describe('JobBoard', () => {
    const mockJobIdList: number[] = [1, 2, 3, 4, 5, 6];
    const mockJobList: {
        id: number;
        title: string;
        by: string;
        time: number;
        url: string;
    }[] = mockJobIdList.map((jobId: number) => ({
        id: jobId,
        title: `Job Title ${jobId}`,
        by: `poster${jobId}`,
        time: 1700000000 + jobId,
        url: `https://example.com/job${jobId}`,
    }));

    beforeEach(() => {
        jest.spyOn(JobBoardService, 'fetchJobsFromApi').mockResolvedValue(
            mockJobList
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should render the board title', async () => {
        await act(async () => {
            render(<JobBoard />);
        });

        const boardTitleElement: HTMLElement = screen.getByText(
            'Hacker News Jobs Board'
        );
        expect(boardTitleElement).toBeInTheDocument();
    });

    it('should render 6 job cards after loading', async () => {
        await act(async () => {
            render(<JobBoard />);
        });

        const jobCardElements: HTMLElement[] = await waitFor(() =>
            screen.getAllByTestId('job-card')
        );
        expect(jobCardElements.length).toBe(6);
    });

    it('should render the load more button', async () => {
        await act(async () => {
            render(<JobBoard />);
        });

        const loadMoreButtonElement: HTMLElement = await screen.findByRole(
            'button',
            { name: 'Load more jobs' }
        );
        expect(loadMoreButtonElement).toBeInTheDocument();
    });

    it('should render job card data for all jobs', async () => {
        await act(async () => {
            render(<JobBoard />);
        });

        const jobCardElements: HTMLElement[] = await waitFor(() =>
            screen.getAllByTestId('job-card')
        );

        expect(jobCardElements.length).toBe(mockJobList.length);

        for (const job of mockJobList) {
            const jobTitleElement: HTMLElement = screen.getByText(job.title);

            expect(jobTitleElement).toBeInTheDocument();

            const jobCardElement: HTMLElement | undefined =
                jobCardElements.find((card) =>
                    card.textContent?.includes(`By ${job.by}`)
                );

            expect(jobCardElement).toBeDefined();
            expect(jobCardElement?.textContent).toContain(`By ${job.by}`);
        }
    });

    it('should show loading state initially', () => {
        render(<JobBoard />);
        const loadingElement: HTMLElement = screen.getByText('Loading jobs...');
        expect(loadingElement).toBeInTheDocument();
    });

    it('should show error message and retry button when fetch fails', async () => {
        (JobBoardService.fetchJobsFromApi as jest.Mock).mockRejectedValueOnce(
            new Error('Network error')
        );

        render(<JobBoard />);

        const errorElement = await screen.findByText(
            'Failed to load jobs. Please try again.'
        );
        expect(errorElement).toBeInTheDocument();

        const retryButton = screen.getByRole('button', { name: 'Retry' });
        expect(retryButton).toBeInTheDocument();
    });

    it('should retry fetching jobs when retry button is clicked', async () => {
        // First call fails, second call succeeds
        (JobBoardService.fetchJobsFromApi as jest.Mock)
            .mockRejectedValueOnce(new Error('Network error'))
            .mockResolvedValueOnce(mockJobList);

        render(<JobBoard />);

        // Wait for error message and retry button
        const retryButton = await screen.findByRole('button', {
            name: 'Retry',
        });

        // Click retry
        await userEvent.click(retryButton);

        // Wait for job cards to appear
        const jobCardElements: HTMLElement[] = await screen.findAllByTestId(
            'job-card'
        );
        expect(jobCardElements.length).toBe(mockJobList.length);
    });
});
