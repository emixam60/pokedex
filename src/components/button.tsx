import React from 'react';

interface ButtonProps {
    label: string;
    onClick: () => void;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${className}`}
        >
            {label}
        </button>
    );
};

export default Button;
