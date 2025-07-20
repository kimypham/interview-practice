import {
    fetchJobsFromApi,
    formatUnixTimeToString,
    Job,
} from './JobBoard.service';

describe('JobBoard.service', () => {
    describe('formatUnixTimeToString', () => {
        it('should return formatted date string when given a typical unix timestamp', () => {
            const unixTimestamp: number = 1672576496; // 2023-01-01T12:34:56Z
            const formattedDateString: string =
                formatUnixTimeToString(unixTimestamp);

            expect(formattedDateString).toMatch(/1\/1\/2023/);
            expect(formattedDateString).toMatch(/(11:|12:)/); // hour
            expect(formattedDateString).toMatch(/:34/); // minute
            expect(formattedDateString).toMatch(/:56/); // second
        });

        it('should return formatted date string when given the unix epoch (0)', () => {
            const unixTimestamp: number = 0;

            const formattedDateString: string =
                formatUnixTimeToString(unixTimestamp);

            expect(formattedDateString).toMatch(/1\/1\/1970/);
        });

        it('should return formatted date string when given a timestamp with single-digit month and day', () => {
            const unixTimestamp: number = 1643861106; // 2022-02-03T04:05:06Z

            const formattedDateString: string =
                formatUnixTimeToString(unixTimestamp);

            expect(formattedDateString).toMatch(/2\/3\/2022/);
        });

        it('should return a string for any valid unix timestamp', () => {
            const unixTimestamp: number = 1234567890;

            const formattedDateString: string =
                formatUnixTimeToString(unixTimestamp);

            expect(typeof formattedDateString).toBe('string');
        });
    });

    describe('fetchJobsFromApi', () => {
        const originalFetch = globalThis.fetch;
        const mockJobIds: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const mockJobDetails: Job[] = mockJobIds.map((id) => ({
            id,
            title: `Job ${id}`,
            by: `poster${id}`,
            time: 1700000000 + id,
            url: `https://example.com/job${id}`,
        }));

        beforeEach(() => {
            globalThis.fetch = jest.fn((input: RequestInfo | URL) => {
                const url =
                    typeof input === 'string' ? input : input.toString();
                if (url.endsWith('jobstories.json')) {
                    return Promise.resolve({
                        json: () => Promise.resolve(mockJobIds),
                    }) as any;
                }
                const match = url.match(/item\/(\d+)\.json/);
                if (match) {
                    const jobId = Number(match[1]);
                    const job = mockJobDetails.find((j) => j.id === jobId);
                    return Promise.resolve({
                        json: () => Promise.resolve(job),
                    }) as any;
                }
                return Promise.reject(new Error('Unknown URL'));
            }) as any;
        });

        afterEach(() => {
            globalThis.fetch = originalFetch;
        });

        it('should fetch the correct number of jobs based on offset and limit', async () => {
            const jobs = await fetchJobsFromApi(0, 5);

            expect(jobs.length).toBe(5);
            expect(jobs[0].id).toBe(1);
            expect(jobs[4].id).toBe(5);
        });

        it('should return an empty array if offset exceeds available jobs', async () => {
            const jobs = await fetchJobsFromApi(15, 5);
            expect(jobs.length).toBe(0);
        });

        it('should handle cases where fewer jobs are available than requested (overrequesting)', async () => {
            const jobs = await fetchJobsFromApi(8, 5);

            expect(jobs.length).toBe(2);
            expect(jobs[0].id).toBe(9);
            expect(jobs[1].id).toBe(10);
        });

        it('should handle network/API errors gracefully', async () => {
            globalThis.fetch = jest.fn(() =>
                Promise.reject(new Error('Network error'))
            );
            const jobs = await fetchJobsFromApi(0, 5);

            expect(jobs.length).toBe(0);
            expect(globalThis.fetch).toHaveBeenCalledWith(
                'https://hacker-news.firebaseio.com/v0/jobstories.json'
            );
        });
    });
});
