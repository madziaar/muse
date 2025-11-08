import { describe, it, expect, vi, afterEach } from 'vitest';

// Mock the ollama/browser module
vi.mock('ollama/browser', () => {
  const mockGenerate = vi.fn();
  const mockChat = vi.fn();
  return {
    Ollama: class {
      constructor() {
        return {
          generate: mockGenerate,
          chat: mockChat,
        };
      }
    },
    __test__mockGenerate: mockGenerate,
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
  summarizeText,
  analyzeVideo,
} from './ollamaService';

// Import the mock function we exported from our mock factory.
import { __test__mockGenerate as mockGenerate } from 'ollama/browser';

describe('Ollama Service', () => {
  afterEach(() => {
    // Clear the mock's history after each test.
    mockGenerate.mockClear();
  });

  describe('generateCreativeAssets', () => {
    it('should return parsed JSON from a valid response', async () => {
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
      mockGenerate.mockResolvedValue({
        response: JSON.stringify(mockResponse),
      });

      const result = await generateCreativeAssets('test idea', 'en', 'lyrics');
      expect(result).toHaveProperty('riffusionPrompt', 'test prompt');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('originalIdea', 'test idea');
    });

    it('should throw an error for invalid JSON response', async () => {
      mockGenerate.mockResolvedValue({
        response: 'this is not json',
      });

      await expect(
        generateCreativeAssets('test idea', 'en', 'lyrics'),
      ).rejects.toThrow();
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

      mockGenerate.mockResolvedValue({
        response: JSON.stringify(refinedResponse),
      });

      const result = await refineCreativeAssets(
        originalContent,
        'make it better',
        'en',
      );
      expect(result.parameters.seed_image_id).toBe('preserved-seed-456');
      expect(result.parameters.scheduler).toBe('DDIM');
      expect(result.riffusionPrompt).toBe('refined prompt');
    });
  });

  describe('getNewIdeas', () => {
    it('should return an array of strings', async () => {
      const mockIdeas = ['idea1', 'idea2'];
      mockGenerate.mockResolvedValue({
        response: JSON.stringify(mockIdeas),
      });

      const result = await getNewIdeas();
      expect(result).toEqual(mockIdeas);
    });
  });

  describe('suggestTags', () => {
    it('should return an array of strings', async () => {
      const mockTags = ['tag1', 'tag2'];
      mockGenerate.mockResolvedValue({
        response: JSON.stringify(mockTags),
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
      mockGenerate.mockResolvedValue({
        response: JSON.stringify({ riffusionPrompt: 'new prompt' }),
      });
      const result = await regenerateRiffusionPrompt(fullContent, 'en');
      expect(result).toBe('new prompt');
    });

    it('regenerateLyrics should return a new string', async () => {
      mockGenerate.mockResolvedValue({
        response: JSON.stringify({ lyrics: 'new lyrics' }),
      });
      const result = await regenerateLyrics(fullContent, 'en');
      expect(result).toBe('new lyrics');
    });

    it('regenerateSongStructure should return a new string', async () => {
      mockGenerate.mockResolvedValue({
        response: JSON.stringify({ songStructure: 'new structure' }),
      });
      const result = await regenerateSongStructure(fullContent, 'en');
      expect(result).toBe('new structure');
    });

    it('regenerateParameters should return a new parameters object', async () => {
      const newParams = { denoising: 0.8 };
      mockGenerate.mockResolvedValue({
        response: JSON.stringify({ parameters: newParams }),
      });
      const result = await regenerateParameters(fullContent, 'en');
      expect(result).toEqual(newParams);
    });
  });

  describe('summarizeText', () => {
    it('should return a summary', async () => {
      mockGenerate.mockResolvedValue({ response: 'This is a summary.' });

      const result = await summarizeText('test text');

      expect(mockGenerate).toHaveBeenCalled();
      expect(result.text).toBe('This is a summary.');
      expect(result.sources).toHaveLength(0);
    });
  });

  describe('analyzeVideo', () => {
    it('should return a text analysis of a video file', async () => {
      mockGenerate.mockResolvedValue({ response: 'This is a video analysis.' });

      // Create a mock file
      const blob = new Blob(['dummy content'], { type: 'video/mp4' });
      const file = new File([blob], 'dummy.mp4', { type: 'video/mp4' });

      const result = await analyzeVideo(file, 'test prompt');

      expect(mockGenerate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'llava',
          prompt: 'test prompt',
        }),
      );
      expect(result).toBe('This is a video analysis.');
    });
  });
});