import React from 'react';

interface ParameterSliderProps {
    label: string;
    name: string;
    value: number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    min: number;
    max: number;
    step: number;
    tooltip: string;
}

/**
 * A slider component for adjusting a parameter.
 *
 * @param {object} props - The component props.
 * @param {string} props.label - The label for the slider.
 * @param {string} props.name - The name of the parameter.
 * @param {number} props.value - The current value of the parameter.
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} props.onChange - The function to call when the value changes.
 * @param {number} props.min - The minimum value of the slider.
 * @param {number} props.max - The maximum value of the slider.
 * @param {number} props.step - The step value of the slider.
 * @param {string} props.tooltip - The tooltip to display on hover.
 * @returns {JSX.Element} The rendered slider component.
 */
export const ParameterSlider: React.FC<ParameterSliderProps> = React.memo(({
    label,
    name,
    value,
    onChange,
    min,
    max,
    step,
    tooltip
}) => {
    return (
        <div className="flex flex-col gap-1.5" title={tooltip}>
            <div className="flex justify-between items-center font-mono text-sm">
                <label htmlFor={`${label}-slider`} className="text-gray-400">{label}:</label>
                <span className="text-fuchsia-400 font-bold bg-gray-800 px-2 py-0.5 rounded">{value}</span>
            </div>
            <input
                id={`${label}-slider`}
                name={name}
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-thumb"
            />
            <style>{`
                .range-thumb::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    background: #06b6d4; /* cyan-500 */
                    border-radius: 50%;
                    cursor: pointer;
                    transition: background .2s;
                }
                .range-thumb::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    background: #06b6d4; /* cyan-500 */
                    border-radius: 50%;
                    cursor: pointer;
                    border: none;
                    transition: background .2s;
                }
                .range-thumb:hover::-webkit-slider-thumb {
                    background: #22d3ee; /* cyan-400 */
                }
                .range-thumb:hover::-moz-range-thumb {
                    background: #22d3ee; /* cyan-400 */
                }
            `}</style>
        </div>
    );
});