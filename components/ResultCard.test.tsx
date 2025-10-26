import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ResultCard } from './ResultCard';
import { GeneratedContent } from '../types';

// Mock the useTranslation hook
vi.mock('../hooks/useTranslation', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

const mockContent: GeneratedContent = {
    id: '1',
    originalIdea: 'A song about the sun',
    generationMode: 'lyrics',
    riffusionPrompt: 'sunshine, happy, upbeat',
    lyrics: '[Verse]\nThe sun is shining bright',
    songStructure: 'Verse - Chorus',
    parameters: {
        denoising: 0.75,
        prompt_strength: 0.8,
        num_inference_steps: 50,
        seed_image_id: 'sunny-day-123',
        scheduler: 'DDIM',
    },
};

describe('ResultCard', () => {
    beforeEach(() => {
        // Mock clipboard API
        Object.assign(navigator, {
            clipboard: {
                writeText: vi.fn().mockResolvedValue(undefined),
            },
        });
    });

    it('should render the generated content correctly', () => {
        render(<ResultCard content={mockContent} onRegenerate={vi.fn()} isLoadingPart={null} />);

        expect(screen.getByText('Riffusion Prompt')).toBeInTheDocument();
        expect(screen.getByText('sunshine, happy, upbeat')).toBeInTheDocument();

        expect(screen.getByText('Lyrics')).toBeInTheDocument();
        expect(screen.getByText(/The sun is shining bright/)).toBeInTheDocument();

        expect(screen.getByText('Song Structure')).toBeInTheDocument();
        expect(screen.getByText('Verse')).toBeInTheDocument();
        expect(screen.getByText('Chorus')).toBeInTheDocument();

        expect(screen.getByText('Parameters')).toBeInTheDocument();
        expect(screen.getByText('sunny-day-123')).toBeInTheDocument();
    });

    it('should call onRegenerate with the correct part when a regenerate button is clicked', () => {
        const onRegenerateMock = vi.fn();
        render(<ResultCard content={mockContent} onRegenerate={onRegenerateMock} isLoadingPart={null} />);

        const regenerateButtons = screen.getAllByTitle('regenerateSection');

        // Click the regenerate button for the Riffusion Prompt
        fireEvent.click(regenerateButtons[0]);
        expect(onRegenerateMock).toHaveBeenCalledWith('riffusionPrompt', mockContent);

        // Click the regenerate button for the Lyrics
        fireEvent.click(regenerateButtons[1]);
        expect(onRegenerateMock).toHaveBeenCalledWith('lyrics', mockContent);
    });

    it('should call clipboard.writeText with the correct content when a copy button is clicked', () => {
        render(<ResultCard content={mockContent} onRegenerate={vi.fn()} isLoadingPart={null} />);

        const copyButtons = screen.getAllByTitle('copyToClipboard');

        // Click the copy button for the Riffusion Prompt
        fireEvent.click(copyButtons[0]);
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('sunshine, happy, upbeat');

        // Click the copy button for the Lyrics
        fireEvent.click(copyButtons[1]);
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('[Verse]\nThe sun is shining bright');
    });

    it('should show a loading spinner for the part being regenerated', () => {
        render(<ResultCard content={mockContent} onRegenerate={vi.fn()} isLoadingPart="lyrics" />);

        const regenerateButtons = screen.getAllByTitle('regenerateSection');
        // The lyrics section's regenerate button should be disabled and showing a spinner
        // We can check for the absence of the RefreshIcon and the presence of the spinner animation
        const lyricsRegenerateButton = regenerateButtons[1].parentElement; // The button is inside a div
        expect(lyricsRegenerateButton?.querySelector('.animate-spin')).toBeInTheDocument();
    });
});
