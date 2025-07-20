import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

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
                const job = mockJobList.find((job) => job.id === jobId);
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

    it('should show error message when fetch fails', async () => {
        (window.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.reject(new Error('Network error'))
        );
        render(<App />);
        const errorMessageElement: HTMLElement = await screen.findByText(
            'Failed to load jobs. Please try again.'
        );

        expect(errorMessageElement).toBeInTheDocument();
    });

    it('should retry fetching jobs when clicking retry button after error', async () => {
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
                    const job = mockJobList.find((job) => job.id === jobId);
                    return Promise.resolve({
                        json: () => Promise.resolve(job),
                    });
                }
                return Promise.reject(new Error('Unknown URL'));
            });

        render(<App />);
        const errorMessageElement: HTMLElement = await screen.findByText(
            'Failed to load jobs. Please try again.'
        );

        expect(errorMessageElement).toBeInTheDocument();

        const retryButtonElement: HTMLElement = screen.getByRole('button', {
            name: 'Retry',
        });
        retryButtonElement.click();
        const jobCardElements: HTMLElement[] = await waitFor(() =>
            screen.getAllByTestId('job-card')
        );

        expect(jobCardElements.length).toBe(6);
    });
});
