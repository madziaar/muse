import React, { useState, ReactNode } from 'react';

interface AccordionProps {
    title: string;
    children: ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-3 text-left text-gray-300 hover:bg-gray-800 focus:outline-none"
            >
                <span className="font-semibold">{title}</span>
                <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    &#9662;
                </span>
            </button>
            {isOpen && (
                <div className="p-3 bg-gray-900/50">
                    {children}
                </div>
            )}
        </div>
    );
};
