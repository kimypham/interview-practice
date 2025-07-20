import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const mockJobIdList: number[] = Array.from({ length: 14 }, (_, i) => i + 1);
const makeMockJobList = (ids: number[]) =>
    ids.map((jobId: number) => ({
        id: jobId,
        title: `Job Title ${jobId}`,
        by: `poster${jobId}`,
        time: 1700000000 + jobId,
        url: `https://example.com/job${jobId}`,
    }));

describe('App', () => {
    beforeEach(() => {
        (window.fetch as jest.Mock) = jest.fn((input: RequestInfo) => {
            let requestUrl: string;
            if (typeof input === 'string') {
                requestUrl = input;
            } else if (input instanceof Request) {
                requestUrl = input.url;
            } else {
                requestUrl = String(input);
            }
            if (requestUrl.endsWith('/jobstories.json')) {
                return Promise.resolve({
                    json: () => Promise.resolve(mockJobIdList),
                });
            }
            const jobIdMatch: RegExpMatchArray | null =
                requestUrl.match(/\/item\/(\d+)\.json/);
            if (jobIdMatch) {
                const jobId: number = Number(jobIdMatch[1]);
                const job = makeMockJobList([jobId])[0];
                return Promise.resolve({
                    json: () => Promise.resolve(job),
                });
            }
            return Promise.reject(new Error('Unknown URL'));
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should render the job board title', async () => {
        render(<App />);
        const boardTitleElement: HTMLElement = await screen.findByText(
            'Hacker News Jobs Board'
        );
        expect(boardTitleElement).toBeInTheDocument();
    });

    it('should render 6 job cards when jobs are loaded', async () => {
        render(<App />);
        const jobCardElements: HTMLElement[] = await waitFor(() =>
            screen.getAllByTestId('job-card')
        );
        expect(jobCardElements.length).toBe(6);
    });

    it('should render the load more button', async () => {
        render(<App />);
        const loadMoreButtonElement: HTMLElement = await screen.findByRole(
            'button',
            { name: 'Load more jobs' }
        );
        expect(loadMoreButtonElement).toBeInTheDocument();
    });

    it('should append 6 more jobs when Load More is clicked', async () => {
        render(<App />);
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

    it('should only append the remaining jobs if fewer than requested remain (overrequesting)', async () => {
        // Simulate 8 jobs total for this test
        (window.fetch as jest.Mock).mockImplementation((input: RequestInfo) => {
            let requestUrl: string;
            if (typeof input === 'string') {
                requestUrl = input;
            } else if (input instanceof Request) {
                requestUrl = input.url;
            } else {
                requestUrl = String(input);
            }
            if (requestUrl.endsWith('/jobstories.json')) {
                // Only 8 jobs
                return Promise.resolve({
                    json: () =>
                        Promise.resolve(
                            Array.from({ length: 8 }, (_, i) => i + 1)
                        ),
                });
            }
            const jobIdMatch: RegExpMatchArray | null =
                requestUrl.match(/\/item\/(\d+)\.json/);
            if (jobIdMatch) {
                const jobId: number = Number(jobIdMatch[1]);
                const job = makeMockJobList([jobId])[0];
                return Promise.resolve({
                    json: () => Promise.resolve(job),
                });
            }
            return Promise.reject(new Error('Unknown URL'));
        });

        render(<App />);
        // Wait for first batch
        await waitFor(() => screen.getAllByTestId('job-card'));
        const jobCardElements1 = await waitFor(() =>
            screen.getAllByTestId('job-card')
        );
        expect(jobCardElements1.length).toBe(6);
        // Click Load More once
        const loadMoreButton = await screen.findByRole('button', {
            name: 'Load more jobs',
        });
        await userEvent.click(loadMoreButton);
        await waitFor(() => screen.getAllByTestId('job-card'));
        const jobCardElements = await waitFor(() =>
            screen.getAllByTestId('job-card')
        );
        expect(jobCardElements.length).toBe(6);
        await userEvent.click(loadMoreButton);
        await waitFor(() => screen.getAllByTestId('job-card'));
        const jobCardElements2 = await waitFor(() =>
            screen.getAllByTestId('job-card')
        );
        expect(jobCardElements2.length).toBe(8);
    });

    it('should hide the LoadMoreButton when all jobs are loaded', async () => {
        render(<App />);
        // Click Load More twice to get all jobs (14 total)
        for (let i = 0; i < 2; i++) {
            const loadMoreButton = await screen.findByRole('button', {
                name: 'Load more jobs',
            });
            await userEvent.click(loadMoreButton);
            await waitFor(() => screen.getAllByTestId('job-card'));
        }
        // Button should not be in the document
        expect(
            screen.queryByRole('button', { name: 'Load more jobs' })
        ).toBeNull();
    });

    it('should show error message when fetch fails', async () => {
        render(<App />);
        (window.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.reject(new Error('Network error'))
        );
        const errorMessageElement: HTMLElement = await screen.findByText(
            'Failed to load jobs. Please try again.'
        );
        expect(errorMessageElement).toBeInTheDocument();
    });

    it('should retry fetching jobs when clicking retry button after error', async () => {
        render(<App />);
        // First call fails, second call succeeds
        (window.fetch as jest.Mock)
            .mockImplementationOnce(() =>
                Promise.reject(new Error('Network error'))
            )
            .mockImplementation((input: RequestInfo) => {
                let requestUrl: string;
                if (typeof input === 'string') {
                    requestUrl = input;
                } else if (input instanceof Request) {
                    requestUrl = input.url;
                } else {
                    requestUrl = String(input);
                }
                if (requestUrl.endsWith('/jobstories.json')) {
                    return Promise.resolve({
                        json: () => Promise.resolve(mockJobIdList),
                    });
                }
                const jobIdMatch: RegExpMatchArray | null =
                    requestUrl.match(/\/item\/(\d+)\.json/);
                if (jobIdMatch) {
                    const jobId: number = Number(jobIdMatch[1]);
                    const job = makeMockJobList([jobId])[0];
                    return Promise.resolve({
                        json: () => Promise.resolve(job),
                    });
                }
                return Promise.reject(new Error('Unknown URL'));
            });
        const errorMessageElement: HTMLElement = await screen.findByText(
            'Failed to load jobs. Please try again.'
        );
        expect(errorMessageElement).toBeInTheDocument();
        const retryButtonElement: HTMLElement = screen.getByRole('button', {
            name: 'Retry',
        });
        await userEvent.click(retryButtonElement);
        const jobCardElements: HTMLElement[] = await waitFor(() =>
            screen.getAllByTestId('job-card')
        );
        expect(jobCardElements.length).toBe(6);
    });
});
