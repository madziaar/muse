import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PromptInput } from './PromptInput';
// Correct the import from AppContext
import { AppProvider } from '../contexts/AppContext';

// Mock the geminiService to avoid actual API calls
vi.mock('../services/geminiService', () => ({
    getNewIdeas: vi.fn(),
    suggestTags: vi.fn(),
}));

// Mock the useTranslation hook
vi.mock('../hooks/useTranslation', () => ({
    useTranslation: () => ({ t: (key: string) => key }), // Simple mock that returns the key
}));

// We need to import the mocked functions to control them in tests
import { getNewIdeas, suggestTags } from '../services/geminiService';

// Updated renderComponent to use the correct provider and pass children
const renderComponent = () => {
    const onGenerate = vi.fn();
    return render(
        <AppProvider>
            <PromptInput onGenerate={onGenerate} isLoading={false} />
        </AppProvider>
    );
};

describe('PromptInput', () => {
    beforeEach(() => {
        // Reset mocks before each test
        vi.resetAllMocks();
        // Provide a default mock implementation for getNewIdeas
        (getNewIdeas as vi.Mock).mockResolvedValue(['An idea', 'Another idea']);
    });

    it('should render the textarea and initial ideas', async () => {
        renderComponent();

        // Check for the placeholder text
        expect(screen.getByPlaceholderText('musePromptPlaceholder')).toBeInTheDocument();

        // The component fetches ideas on mount, so we wait for them to appear
        await waitFor(() => {
            expect(screen.getByText('An idea')).toBeInTheDocument();
            expect(screen.getByText('Another idea')).toBeInTheDocument();
        });

        // Verify that getNewIdeas was called
        expect(getNewIdeas).toHaveBeenCalledTimes(1);
    });

    it('should call onGenerate when the generate button is clicked', () => {
        const onGenerateMock = vi.fn();
        render(
            <AppProvider>
                <PromptInput onGenerate={onGenerateMock} isLoading={false} />
            </AppProvider>
        );

        const textarea = screen.getByPlaceholderText('musePromptPlaceholder');
        const generateButton = screen.getByRole('button', { name: 'museGenerate' });

        // The button should be disabled initially
        expect(generateButton).toBeDisabled();

        // Type some text into the textarea
        fireEvent.change(textarea, { target: { value: 'A new song about a river' } });

        // The button should now be enabled
        expect(generateButton).not.toBeDisabled();

        // Click the button
        fireEvent.click(generateButton);

        // Expect the onGenerate function to have been called
        expect(onGenerateMock).toHaveBeenCalledTimes(1);
    });

    it('should suggest tags when the user types a long prompt', async () => {
        (suggestTags as vi.Mock).mockResolvedValue(['rock', 'guitar', 'upbeat']);

        renderComponent();

        const textarea = screen.getByPlaceholderText('musePromptPlaceholder');

        // Type a prompt that is long enough to trigger tag suggestions
        fireEvent.change(textarea, { target: { value: 'A fast-paced rock song with a catchy guitar riff' } });

        // Wait for the debounced call and the tags to appear
        await waitFor(() => {
            expect(suggestTags).toHaveBeenCalledWith('A fast-paced rock song with a catchy guitar riff');
        });

        // Check if the suggested tags are rendered
        expect(screen.getByText('+ rock')).toBeInTheDocument();
        expect(screen.getByText('+ guitar')).toBeInTheDocument();
        expect(screen.getByText('+ upbeat')).toBeInTheDocument();
    });

    it('should clear the input when the clear button is clicked', async () => {
        renderComponent();

        const textarea = screen.getByPlaceholderText('musePromptPlaceholder');

        // Type something to make the clear button appear
        fireEvent.change(textarea, { target: { value: 'some text' } });

        // The clear button should now be in the document
        const clearButton = await screen.findByTitle('clearInput');
        expect(clearButton).toBeInTheDocument();

        // Click the clear button
        fireEvent.click(clearButton);

        // The textarea should be empty
        expect(textarea).toHaveValue('');
    });
});
