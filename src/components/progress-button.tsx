// components/ProgressButton.tsx
import React from 'react';
import { ButtonProps } from '@/components/ui/button'; // Import Button and ButtonProps from shadcn

interface ProgressButtonProps extends ButtonProps {
    percentage: number; // Add percentage prop
}

const ProgressButton: React.FC<ProgressButtonProps> = ({ percentage, children, ...props }) => {
    return (
        <button
            className={`relative text-white text-sm px-4 py-2 rounded-md overflow-hidden transition-opacity ${props.disabled
                ? 'bg-teal-400 cursor-not-allowed'
                : 'bg-teal-500 hover:opacity-75'
                }`}
            {...props}
        >
            {/* Progress bar */}
            <span
                className={`absolute left-0 top-0 h-full ${props.disabled ? 'opacity-75 bg-teal-600' : 'bg-teal-700'}`}
                style={{ width: `${percentage}%` }}
            ></span>

            {/* Button text */}
            <span className="relative flex justify-center">{children}</span>
        </button>
    );
};

export default ProgressButton;
