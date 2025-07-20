import React, { useEffect, useRef, useState } from 'react';
import {
    fetchJobsFromApi,
    formatUnixTimeToString,
    Job,
} from './JobBoard.service';
import JobCard from './JobCard';
import LoadMoreButton from './LoadMoreButton';

const JOBS_PER_PAGE: number = 6;

const JobBoard: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const [allLoaded, setAllLoaded] = useState<boolean>(false);
    const isFetching = useRef<boolean>(false);

    const fetchJobs = async (reset: boolean = false) => {
        if (isFetching.current) return;
        isFetching.current = true;
        setLoading(true);
        setError(null);
        try {
            const newJobs: Job[] = await fetchJobsFromApi(
                reset ? 0 : offset,
                JOBS_PER_PAGE
            );
            if (reset) {
                setJobs(newJobs);
                setOffset(newJobs.length);
                setAllLoaded(newJobs.length < JOBS_PER_PAGE);
            } else {
                setJobs((prevJobs) => {
                    // Prevent duplicates
                    const newJobIds = new Set(prevJobs.map((j) => j.id));
                    const filteredNewJobs = newJobs.filter(
                        (j) => !newJobIds.has(j.id)
                    );
                    return [...prevJobs, ...filteredNewJobs];
                });
                setOffset((prevOffset) => prevOffset + newJobs.length);
                if (newJobs.length < JOBS_PER_PAGE) {
                    setAllLoaded(true);
                }
            }
        } catch (err) {
            setError('Failed to load jobs. Please try again.');
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    };

    useEffect(() => {
        fetchJobs(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLoadMore = () => {
        if (!allLoaded && !loading && !isFetching.current) {
            fetchJobs();
        }
    };

    const handleRetry = () => {
        fetchJobs(true);
    };

    return (
        <div className="bg-[#f5f3ea] min-h-screen py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-orange-500 font-bold text-4xl mb-8">
                    Hacker News Jobs Board
                </h1>
                {loading && jobs.length === 0 ? (
                    <div className="text-center text-gray-500">
                        Loading jobs...
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500">
                        {error}
                        <button
                            className="ml-4 underline text-orange-500"
                            onClick={handleRetry}
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <>
                        {jobs.map((job) => (
                            <JobCard
                                key={job.id}
                                title={job.title}
                                poster={job.by}
                                date={formatUnixTimeToString(job.time)}
                                url={job.url}
                            />
                        ))}
                        {!allLoaded && !loading && !error && (
                            <LoadMoreButton onClick={handleLoadMore} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default JobBoard;
