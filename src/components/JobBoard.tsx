import React from 'react';
import JobCard from './JobCard';
import LoadMoreButton from './LoadMoreButton';

const mockJobs = [
    {
        title: 'Firezone (YC W22) is hiring Elixir and Rust engineers',
        poster: 'jamilbk',
        date: '5/12/2023, 5:01:12 AM',
    },
    {
        title: 'RankScience (YC W17) is hiring SDRs with a knack for SEO',
        poster: 'ryanb',
        date: '5/12/2023, 1:01:10 AM',
    },
    {
        title: 'OneSignal (YC S11) Is Hiring Engineers',
        poster: 'gdegli',
        date: '5/11/2023, 8:00:48 PM',
    },
    {
        title: 'QuestDB (YC S20) Is Hiring a Technical Content Lead',
        poster: 'nhourcard',
        date: '5/11/2023, 5:00:10 AM',
    },
    {
        title: 'Aviator (YC S21) is hiring senior engineers to build the DX platform',
        poster: 'ankitdce',
        date: '5/11/2023, 1:00:08 AM',
    },
    {
        title: 'Aptible (YC S14) Is Hiring: Security Engineer and Head of Product',
        poster: 'fancyremarker',
        date: '5/10/2023, 5:02:06 AM',
    },
];

const JobBoard: React.FC = () => (
    <div className="bg-[#f5f3ea] min-h-screen py-8">
        <div className="max-w-2xl mx-auto">
            <h1 className="text-orange-500 font-bold text-4xl mb-8">
                Hacker News Jobs Board
            </h1>
            {mockJobs.map((job, idx) => (
                <JobCard
                    key={idx}
                    title={job.title}
                    poster={job.poster}
                    date={job.date}
                />
            ))}
            <LoadMoreButton />
        </div>
    </div>
);

export default JobBoard;
