import React from 'react';

interface LoadMoreButtonProps {
    onClick?: () => void;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ onClick }) => (
    <button
        className="bg-orange-500 text-white rounded-md px-6 py-3 text-lg font-medium mt-6 cursor-pointer hover:bg-orange-600 transition-colors"
        onClick={onClick}
    >
        Load more jobs
    </button>
);

export default LoadMoreButton;
