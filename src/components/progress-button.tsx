// components/ProgressButton.tsx
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button'; // Import Button and ButtonProps from shadcn
import { Progress } from './ui/progress';

interface ProgressButtonProps extends ButtonProps {
    percentage: number; // Add percentage prop
}

const ProgressButton: React.FC<ProgressButtonProps> = ({ percentage, children, ...props }) => {
    return (
        <button
            className={`relative text-white text-sm px-4 py-2 rounded-md overflow-hidden transition-opacity ${props.disabled
                ? 'bg-teal-500 cursor-not-allowed'
                : 'bg-teal-600 hover:opacity-75'
                }`}
            {...props}
        >
            {/* Progress bar */}
            <span
                className={`absolute left-0 top-0 h-full bg-teal-700 ${props.disabled ? 'opacity-75' : ''}`}
                style={{ width: `${percentage}%` }}
            ></span>

            {/* Button text */}
            <span className="relative flex justify-center">{children}</span>
        </button>
    );
};

export default ProgressButton;
