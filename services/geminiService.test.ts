import { describe, it, expect, vi, afterEach } from 'vitest';

// Mock the @google/genai module. The factory is hoisted by Vitest.
vi.mock('@google/genai', async (importOriginal) => {
    const actual = await importOriginal();
    // Create the mock function inside the factory to avoid hoisting issues.
    const mockGenerateContent = vi.fn();
    const mockChat = { sendMessage: vi.fn() };

    return {
        ...(actual as any),
        // Mock GoogleGenAI as a class that returns our mock function.
        GoogleGenAI: class {
            constructor() {
                return {
                    models: {
                        generateContent: mockGenerateContent,
                    },
                    chats: {
                        create: vi.fn().mockReturnValue(mockChat),
                    },
                };
            }
        },
        // Export the mock function so our tests can import and control it.
        __test__mockGenerateContent: mockGenerateContent,
    };
});

// NOW we can import everything. The mock is already in place.
import {
  generateCreativeAssets,
  refineCreativeAssets,
  getNewIdeas,
  suggestTags,
  regenerateRiffusionPrompt,
  regenerateLyrics,
  regenerateSongStructure,
  regenerateParameters,
} from './geminiService';

// Import the mock function we exported from our mock factory.
import { __test__mockGenerateContent as mockGenerateContent } from '@google/genai';

describe('Gemini Service', () => {
  afterEach(() => {
    // Clear the mock's history after each test.
    mockGenerateContent.mockClear();
  });

  describe('generateCreativeAssets', () => {
    it('should return parsed JSON from a valid markdown response', async () => {
      const mockResponse = {
        riffusionPrompt: 'test prompt',
        lyrics: 'test lyrics',
        songStructure: 'test structure',
        parameters: {
          denoising: 0.5,
          prompt_strength: 0.5,
          num_inference_steps: 50,
          seed_image_id: 'test-seed-123',
        },
      };
      mockGenerateContent.mockResolvedValue({
        text: `\`\`\`json\n${JSON.stringify(mockResponse)}\n\`\`\``,
      });

      const result = await generateCreativeAssets('test idea', 'en', 'lyrics');
      expect(result).toHaveProperty('riffusionPrompt', 'test prompt');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('originalIdea', 'test idea');
    });

    it('should throw an error for invalid JSON response', async () => {
        mockGenerateContent.mockResolvedValue({
            text: 'this is not json',
        });

        await expect(generateCreativeAssets('test idea', 'en', 'lyrics')).rejects.toThrow();
    });
  });

  describe('refineCreativeAssets', () => {
    it('should preserve seed_image_id and scheduler during refinement', async () => {
      const originalContent = {
        id: '123',
        originalIdea: 'original idea',
        generationMode: 'lyrics',
        riffusionPrompt: 'original prompt',
        lyrics: 'original lyrics',
        songStructure: 'original structure',
        parameters: {
          denoising: 0.5,
          prompt_strength: 0.5,
          num_inference_steps: 50,
          seed_image_id: 'preserved-seed-456',
          scheduler: 'DDIM',
        },
      };

      const refinedResponse = {
        riffusionPrompt: 'refined prompt',
        lyrics: 'refined lyrics',
        songStructure: 'refined structure',
        parameters: {
            denoising: 0.6,
            prompt_strength: 0.6,
            num_inference_steps: 60,
            seed_image_id: 'new-seed-789', // This should be ignored
        },
      };

      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(refinedResponse),
      });

      const result = await refineCreativeAssets(originalContent, 'make it better', 'en');
      expect(result.parameters.seed_image_id).toBe('preserved-seed-456');
      expect(result.parameters.scheduler).toBe('DDIM');
      expect(result.riffusionPrompt).toBe('refined prompt');
    });
  });

  describe('getNewIdeas', () => {
    it('should return an array of strings', async () => {
        const mockIdeas = ['idea1', 'idea2'];
        mockGenerateContent.mockResolvedValue({
            text: JSON.stringify(mockIdeas),
        });

        const result = await getNewIdeas();
        expect(result).toEqual(mockIdeas);
    });
  });

  describe('suggestTags', () => {
    it('should return an array of strings', async () => {
        const mockTags = ['tag1', 'tag2'];
        mockGenerateContent.mockResolvedValue({
            text: JSON.stringify(mockTags),
        });

        const result = await suggestTags('my idea');
        expect(result).toEqual(mockTags);
    });
  });

  describe('Regeneration Functions', () => {
    const fullContent = {
        id: '123',
        originalIdea: 'original idea',
        generationMode: 'lyrics',
        riffusionPrompt: 'original prompt',
        lyrics: 'original lyrics',
        songStructure: 'original structure',
        parameters: {
            denoising: 0.5,
            prompt_strength: 0.5,
            num_inference_steps: 50,
            seed_image_id: 'preserved-seed-456',
            scheduler: 'DDIM',
        },
    };

    it('regenerateRiffusionPrompt should return a new string', async () => {
        mockGenerateContent.mockResolvedValue({ text: JSON.stringify({ riffusionPrompt: 'new prompt' }) });
        const result = await regenerateRiffusionPrompt(fullContent, 'en');
        expect(result).toBe('new prompt');
    });

    it('regenerateLyrics should return a new string', async () => {
        mockGenerateContent.mockResolvedValue({ text: JSON.stringify({ lyrics: 'new lyrics' }) });
        const result = await regenerateLyrics(fullContent, 'en');
        expect(result).toBe('new lyrics');
    });

    it('regenerateSongStructure should return a new string', async () => {
        mockGenerateContent.mockResolvedValue({ text: JSON.stringify({ songStructure: 'new structure' }) });
        const result = await regenerateSongStructure(fullContent, 'en');
        expect(result).toBe('new structure');
    });

    it('regenerateParameters should return a new parameters object', async () => {
        const newParams = { denoising: 0.8 };
        mockGenerateContent.mockResolvedValue({ text: JSON.stringify({ parameters: newParams }) });
        const result = await regenerateParameters(fullContent, 'en');
        expect(result).toEqual(newParams);
    });
  });
});
