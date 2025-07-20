import React, { useEffect, useState } from 'react';
import {
    fetchJobsFromApi,
    formatUnixTimeToString,
    Job,
} from './JobBoard.service';
import JobCard from './JobCard';
import LoadMoreButton from './LoadMoreButton';

const JobBoard: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const jobsData: Job[] = await fetchJobsFromApi();
            setJobs(jobsData);
        } catch (err) {
            setError('Failed to load jobs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <div className="bg-[#f5f3ea] min-h-screen py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-orange-500 font-bold text-4xl mb-8">
                    Hacker News Jobs Board
                </h1>
                {loading ? (
                    <div className="text-center text-gray-500">
                        Loading jobs...
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500">
                        {error}
                        <button
                            className="ml-4 underline text-orange-500"
                            onClick={fetchJobs}
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    jobs.map((job) => (
                        <JobCard
                            key={job.id}
                            title={job.title}
                            poster={job.by}
                            date={formatUnixTimeToString(job.time)}
                            url={job.url}
                        />
                    ))
                )}
                <LoadMoreButton />
            </div>
        </div>
    );
};

export default JobBoard;
