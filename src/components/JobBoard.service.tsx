export interface Job {
    id: number;
    title: string;
    by: string;
    time: number;
    url?: string;
}

export function formatUnixTimeToString(unix: number): string {
    const date = new Date(unix * 1000);
    return date.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
}

export async function fetchJobsFromApi(): Promise<Job[]> {
    const jobStoriesResponse: Response = await fetch(
        'https://hacker-news.firebaseio.com/v0/jobstories.json'
    );
    const jobIds: number[] = await jobStoriesResponse.json();
    const fetchedJobIds: number[] = jobIds.slice(0, 6);
    const jobDetailPromises: Promise<Job>[] = fetchedJobIds.map(
        (jobId: number) =>
            fetch(
                `https://hacker-news.firebaseio.com/v0/item/${jobId}.json`
            ).then((res) => res.json())
    );
    return Promise.all(jobDetailPromises);
}
