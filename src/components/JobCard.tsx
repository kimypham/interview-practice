import React from 'react';

interface JobCardProps {
    title: string;
    poster: string;
    date: string;
    url?: string;
}

const JobCard: React.FC<JobCardProps> = ({ title, poster, date, url }) => {
    const handleClick = () => {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };
    return (
        <div
            className="job-card bg-white rounded-lg p-5 mb-5 shadow-sm border border-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400 hover:bg-orange-50 transition-colors"
            tabIndex={0}
            role="button"
            data-testid="job-card"
            onClick={url ? handleClick : undefined}
        >
            <div className="font-bold text-xl mb-2">{title}</div>
            <div className="text-gray-600 text-base">
                By {poster} · {date}
            </div>
        </div>
    );
};

export default JobCard;
