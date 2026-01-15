import React from 'react';

interface Props {
    onClick?: (e: React.MouseEvent) => void;
    icon?: React.ReactNode;
    className?: string;
    title?: string;
    children?: React.ReactNode;
    [x: string]: any
}
const Button: React.FC<Props> = ({
    icon,
    className = '',
    title,
    children,
    onClick,
}) => {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation()
                onClick?.(e);
            }}
            className={`flex items-center gap-2 p-1.5 rounded transition-all cursor-pointer ${className}`}
            title={title}
        >
            {icon ? icon : null}
            {children}
        </button>
    );
};
export default Button;