import { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    disabled = false,
}) => {
    const baseClasses = 'px-4 py-2 rounded font-medium transition-colors';
    const variantClasses = {
        primary:
            'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400',
        secondary:
            'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100',
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]}`}
            onClick={onClick}
            disabled={disabled}
            data-testid="button"
        >
            {children}
        </button>
    );
};
