import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JobBoard from './JobBoard';
import * as JobBoardService from './JobBoard.service';

describe('JobBoard', () => {
    // Helper to generate a list of jobs
    const makeJobList = (start: number, count: number) =>
        Array.from({ length: count }, (_, i) => ({
            id: start + i,
            title: `Job Title ${start + i}`,
            by: `poster${start + i}`,
            time: 1700000000 + start + i,
            url: `https://example.com/job${start + i}`,
        }));

    beforeEach(() => {
        jest.spyOn(JobBoardService, 'fetchJobsFromApi').mockImplementation(
            (offset: number = 0, limit: number = 6) => {
                // Simulate a total of 12 jobs for most tests
                const totalJobs = 12;
                const jobs = makeJobList(1, totalJobs);
                return Promise.resolve(jobs.slice(offset, offset + limit));
            }
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
        // Wait for first batch
        let jobCardElements: HTMLElement[] = await waitFor(() =>
            screen.getAllByTestId('job-card')
        );
        // Click Load More twice to get 12 jobs
        for (let i = 0; i < 1; i++) {
            const loadMoreButton = await screen.findByRole('button', {
                name: 'Load more jobs',
            });
            await userEvent.click(loadMoreButton);
            await waitFor(() => screen.getAllByTestId('job-card'));
        }
        jobCardElements = await waitFor(() =>
            screen.getAllByTestId('job-card')
        );
        expect(jobCardElements.length).toBe(12);
        for (const job of makeJobList(1, 12)) {
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
            .mockResolvedValueOnce(makeJobList(1, 6)); // Updated mock

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
        expect(jobCardElements.length).toBe(6);
    });

    it('should append 6 more jobs when Load More is clicked', async () => {
        render(<JobBoard />);
        // Wait for first batch
        let jobCardElements = await waitFor(() =>
            screen.getAllByTestId('job-card')
        );
        expect(jobCardElements.length).toBe(6);
        // Click Load More once
        const loadMoreButton = await screen.findByRole('button', {
            name: 'Load more jobs',
        });
        await userEvent.click(loadMoreButton);
        await waitFor(() => screen.getAllByTestId('job-card'));
        // Click Load More again to get 12 jobs
        const loadMoreButton2 = await screen.findByRole('button', {
            name: 'Load more jobs',
        });
        await userEvent.click(loadMoreButton2);
        jobCardElements = await waitFor(() =>
            screen.getAllByTestId('job-card')
        );
        expect(jobCardElements.length).toBe(12);
    });

    it('should hide the LoadMoreButton when all jobs are loaded', async () => {
        const firstBatch = Array.from({ length: 6 }, (_, i) => ({
            id: i + 1,
            title: `Job Title ${i + 1}`,
            by: `poster${i + 1}`,
            time: 1700000000 + i + 1,
            url: `https://example.com/job${i + 1}`,
        }));
        const secondBatch = Array.from({ length: 4 }, (_, i) => ({
            id: i + 7,
            title: `Job Title ${i + 7}`,
            by: `poster${i + 7}`,
            time: 1700000000 + i + 7,
            url: `https://example.com/job${i + 7}`,
        }));
        (JobBoardService.fetchJobsFromApi as jest.Mock)
            .mockResolvedValueOnce(firstBatch)
            .mockResolvedValueOnce(secondBatch);

        render(<JobBoard />);

        // Wait for first batch
        await screen.findAllByTestId('job-card');

        // Click Load More
        const loadMoreButton = screen.getByRole('button', {
            name: 'Load more jobs',
        });
        await userEvent.click(loadMoreButton);

        // Wait for all jobs
        await screen.findAllByTestId('job-card');

        // Button should not be in the document
        expect(
            screen.queryByRole('button', { name: 'Load more jobs' })
        ).toBeNull();
    });

    it('should only append the remaining jobs if fewer than requested remain (overrequesting)', async () => {
        // Simulate 8 jobs total for this test
        (JobBoardService.fetchJobsFromApi as jest.Mock).mockImplementation(
            (offset: number = 0, limit: number = 6) => {
                const totalJobs = 8;
                const jobs = makeJobList(1, totalJobs);
                return Promise.resolve(jobs.slice(offset, offset + limit));
            }
        );
        render(<JobBoard />);
        // Wait for first batch
        await waitFor(() => screen.getAllByTestId('job-card'));
        // Click Load More once
        const loadMoreButton = await screen.findByRole('button', {
            name: 'Load more jobs',
        });
        await userEvent.click(loadMoreButton);
        await waitFor(() => screen.getAllByTestId('job-card'));
        const jobCardElements = await waitFor(() =>
            screen.getAllByTestId('job-card')
        );
        expect(jobCardElements.length).toBe(8);
    });

    it('should not fetch more jobs if all jobs are already loaded', async () => {
        const firstBatch = Array.from({ length: 6 }, (_, i) => ({
            id: i + 1,
            title: `Job Title ${i + 1}`,
            by: `poster${i + 1}`,
            time: 1700000000 + i + 1,
            url: `https://example.com/job${i + 1}`,
        }));
        (JobBoardService.fetchJobsFromApi as jest.Mock)
            .mockResolvedValueOnce(firstBatch)
            .mockResolvedValueOnce([]);

        render(<JobBoard />);

        // Wait for first batch
        await screen.findAllByTestId('job-card');

        // Click Load More
        const loadMoreButton = screen.getByRole('button', {
            name: 'Load more jobs',
        });
        await userEvent.click(loadMoreButton);

        // Wait for all jobs
        await screen.findAllByTestId('job-card');

        // Button should not be in the document
        expect(
            screen.queryByRole('button', { name: 'Load more jobs' })
        ).toBeNull();
    });

    it('should handle rapid multiple clicks gracefully (no duplicate jobs)', async () => {
        render(<JobBoard />);
        // Wait for first batch
        await waitFor(() => screen.getAllByTestId('job-card'));
        // Click Load More twice rapidly
        for (let i = 0; i < 2; i++) {
            if (screen.queryByRole('button', { name: 'Load more jobs' })) {
                const loadMoreButton = await screen.findByRole('button', {
                    name: 'Load more jobs',
                });
                await userEvent.click(loadMoreButton);
                await waitFor(() => screen.getAllByTestId('job-card'));
            }
        }
        const jobCardElements = await waitFor(() =>
            screen.getAllByTestId('job-card')
        );
        expect(jobCardElements.length).toBe(12);
    });
});
