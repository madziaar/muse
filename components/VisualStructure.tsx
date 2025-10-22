import React from 'react';
import { MicIcon, StarIcon, StructureIcon, GuitarIcon, LyricsIcon } from './Icons';

interface VisualStructureProps {
    structure: string;
}

/**
 * Returns an icon for a given song part.
 *
 * @param {string} part - The name of the song part.
 * @returns {JSX.Element} The corresponding icon.
 */
const getIconForPart = (part: string) => {
    const lowerPart = part.toLowerCase();
    if (lowerPart.includes('verse')) return <MicIcon className="w-5 h-5" />;
    if (lowerPart.includes('chorus')) return <StarIcon className="w-5 h-5" />;
    if (lowerPart.includes('solo') || lowerPart.includes('instrumental')) return <GuitarIcon className="w-5 h-5" />;
    if (lowerPart.includes('bridge') || lowerPart.includes('intro') || lowerPart.includes('outro')) return <StructureIcon className="w-5 h-5" />;
    return <LyricsIcon className="w-5 h-5" />;
};

/**
 * Returns a color class for a given song part.
 *
 * @param {string} part - The name of the song part.
 * @returns {string} The corresponding color class.
 */
const getColorForPart = (part: string) => {
    const lowerPart = part.toLowerCase();
    if (lowerPart.includes('verse')) return 'bg-sky-800/50 text-sky-300 border-sky-600';
    if (lowerPart.includes('chorus')) return 'bg-amber-800/50 text-amber-300 border-amber-600';
    if (lowerPart.includes('solo') || lowerPart.includes('instrumental')) return 'bg-fuchsia-800/50 text-fuchsia-300 border-fuchsia-600';
    if (lowerPart.includes('bridge')) return 'bg-emerald-800/50 text-emerald-300 border-emerald-600';
    if (lowerPart.includes('intro') || lowerPart.includes('outro')) return 'bg-gray-700/80 text-gray-300 border-gray-600';
    return 'bg-gray-700 text-gray-300 border-gray-600';
}

/**
 * A component that displays a visual representation of a song structure.
 *
 * @param {object} props - The component props.
 * @param {string} props.structure - The song structure string.
 * @returns {JSX.Element} The rendered visual structure.
 */
export const VisualStructure: React.FC<VisualStructureProps> = React.memo(({ structure }) => {
    const parts = structure.split(' - ');

    return (
        <div className="mt-4 text-gray-300 font-mono bg-gray-900 p-4 rounded-md text-center tracking-wider flex flex-wrap items-center justify-center gap-2">
            {parts.map((part, index, arr) => (
                <React.Fragment key={index}>
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getColorForPart(part)}`}>
                        {getIconForPart(part)}
                        <span className="font-bold text-sm">{part}</span>
                    </div>
                    {index < arr.length - 1 && <span className="text-gray-500 font-bold text-lg mx-1">&rarr;</span>}
                </React.Fragment>
            ))}
        </div>
    );
});