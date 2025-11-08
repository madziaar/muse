import { Ollama } from 'ollama/browser';
import { GeneratedContent, RiffusionParameters, ChatMessage } from '../types';

const ollama = new Ollama({ host: 'http://localhost:11434' });
const model = 'gemma:2b';

/**
 * Extracts a JSON object from a string, which might be wrapped in markdown code blocks.
 * @param text The input string from the model response.
 * @returns The parsed JSON object.
 * @throws An error if JSON cannot be parsed.
 */
function extractJson(text: string): any {
  const match = text.match(/```json\n([\s\S]*?)\n```/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      console.error(
        'Failed to parse JSON from markdown in model response:',
        text,
        e,
      );
      throw new Error('Invalid JSON response from the model (markdown).');
    }
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse raw text as JSON:', text, e);
  }
  throw new Error("Could not find or parse JSON in the model's response.");
}

const KNOWLEDGE_BASE = `
**Knowledge Base on Lyrical and Instrumental Styles:**

*   **Lyrical Variety:** You can generate various styles. Be aware of these common forms:
    *   **Narrative/Storytelling:** Tells a clear story with a beginning, middle, and end (e.g., "The Ballad of John and Yoko").
    *   **Abstract/Impressionistic:** Evokes emotions and moods rather than a clear story. Uses symbolic or fragmented imagery.
    *   **Confessional/Introspective:** Personal, direct, and sincere, revealing the songwriter’s innermost thoughts (e.g., "Fast Car").
    *   **Political/Social Commentary:** Addresses social or cultural issues, either directly or through metaphor (e.g., "Blowin’ in the Wind").
    *   **Conversational:** Mimics natural speech, as if speaking directly to the listener (e.g., "You’ve Got a Friend").
    *   **Anthemic/Inspirational:** Aims to inspire or rally listeners with uplifting messages (e.g., "Eye of the Tiger").

*   **Instrumental Guidance:** For instrumentals, the goal is to create a 'story without words'. Use the 'lyrics' field to provide a detailed, section-by-section guide for the AI.
    *   **Use Structural Tags:** Delineate sections with tags like [Intro], [Verse], [Chorus], [Bridge], [Solo], [Outro].
    *   **Provide Descriptive Detail:** Inside the tags, describe the mood, instrumentation, dynamics, and musical ideas for that specific section. This gives much finer control than the simple "Instrumental Mode". For example: "[Intro]\\n[Soft, ethereal synth pads slowly fade in...]\\n[A single, resonant cello note enters...]".
`;

/**
 * Constructs the system prompt for the main 'Muse' generation feature.
 * @param language The user's selected language.
 * @param generationMode Whether to generate 'lyrics' or an 'instrumental' guide.
 * @param structureHint An optional user-provided song structure.
 * @param negativePrompt Optional tags for the AI to avoid.
 * @param advancedParams Optional advanced parameters like scheduler or seed.
 * @returns A fully constructed system prompt string.
 */
const getMuseSystemPrompt = (
  language: string,
  generationMode: 'lyrics' | 'instrumental',
  structureHint?: string,
  negativePrompt?: string,
  advancedParams?: Partial<RiffusionParameters>,
) => {
  let prompt = `You are an expert creative assistant for musicians using the Riffusion model. Your primary goal is to convert a user's natural language musical idea into a set of precise, useful assets.

    ${KNOWLEDGE_BASE}

    **CRITICAL RULE 1:** The 'riffusionPrompt' output MUST be a comma-separated list of descriptive tags. DO NOT use natural language sentences.
    **CRITICAL RULE 2:** To comply with safety filters, DO NOT use the names of specific artists, bands, or songs in your output. Instead, describe the *style* of the music (e.g., 'rock music in the style of the late 60s British invasion' instead of using a band name).

    The user's idea is: "{idea}".
    The user wants to generate: ${generationMode}.
    The user's language is: ${language}.
    `;

  if (negativePrompt) {
    prompt += `\n**Negative Prompt:** The user wants to AVOID the following themes or instruments: "${negativePrompt}". Ensure the generated 'riffusionPrompt' and 'lyrics' do not contain these elements. The 'negativePrompt' output field should reflect this.`;
  }

  if (generationMode === 'lyrics') {
    prompt +=
      "\n**Lyrics Generation:** Generate creative, structured song lyrics that fit the user's idea. Use parentheses () ONLY for backing vocals and square brackets [] ONLY for structural tags like [Verse] or [Chorus]. **Crucially, ensure each section (e.g., [Verse], [Chorus], [Bridge]) is separated by a single blank line for readability.**";
  } else {
    // instrumental
    prompt +=
      "\n**Instrumental Guide Generation:** The 'lyrics' field should NOT contain sung words. Instead, create a detailed guide for an instrumental piece. Use structural tags like [Intro], [Verse], [Solo]. Following each structural tag, EACH subsequent descriptive line MUST also be enclosed in its own square brackets [] and be on a new line. This creates a list of distinct instructions. For example: '[Intro]\\n[Soft, ethereal synth pads slowly fade in...]\\n[A single, resonant cello note enters...]'";
  }

  if (structureHint) {
    prompt += `\n\n**Structure Hint:** The user has suggested a structure. Please adhere to it: ${structureHint}`;
  }

  if (advancedParams?.scheduler) {
    prompt += `\n\n**Advanced Parameters:** The user has specified a scheduler: "${advancedParams.scheduler}". Include this in the parameters output.`;
  }

  if (advancedParams?.seed_image_id) {
    prompt += `\n\n**Advanced Parameters:** The user has specified a seed: "${advancedParams.seed_image_id}". You MUST use this exact seed_image_id in your output.`;
  } else {
    prompt +=
      "\n\nThe seed_image_id should be a unique, random, two-word string followed by a number (e.g., 'blue-ocean-88').";
  }

  prompt += '\n\nGenerate a JSON object with the required structure.';
  return prompt;
};

/**
 * Generates a full set of creative assets based on a user's musical idea.
 * @param idea The user's natural language prompt.
 * @param language The current UI language.
 * @param generationMode The mode of generation ('lyrics' or 'instrumental').
 * @param structureHint An optional pre-defined structure.
 * @param negativePrompt Optional comma-separated tags to avoid.
 * @param advancedParams Optional advanced generation parameters.
 * @returns A promise that resolves to the generated content.
 */
export const generateCreativeAssets = async (
  idea: string,
  language: string,
  generationMode: 'lyrics' | 'instrumental',
  structureHint?: string,
  negativePrompt?: string,
  advancedParams?: Partial<RiffusionParameters>,
): Promise<GeneratedContent> => {
  const systemPrompt = getMuseSystemPrompt(
    language,
    generationMode,
    structureHint,
    negativePrompt,
    advancedParams,
  ).replace('{idea}', idea);

  const response = await ollama.generate({
    model,
    prompt: systemPrompt,
    format: 'json',
  });

  const parsedJson = extractJson(response.response);
  return {
    ...parsedJson,
    id: Date.now().toString(),
    generationMode,
    originalIdea: idea,
  };
};

/**
 * Refines an existing set of creative assets based on a user's query.
 * @param currentContent The current set of generated assets.
 * @param refineQuery The user's natural language instruction for refinement.
 * @param language The current UI language.
 * @returns A promise that resolves to the new, refined content.
 */
export const refineCreativeAssets = async (
  currentContent: GeneratedContent,
  refineQuery: string,
  language: string,
): Promise<GeneratedContent> => {
  let prompt = `
        The user wants to refine a set of creative music assets based on their original idea: "${currentContent.originalIdea}".
        The refinement instruction is: "${refineQuery}".
        The current assets are:
        ${JSON.stringify(currentContent, null, 2)}

        Apply the refinement and generate a new, complete JSON object with the same structure, keeping the same seed_image_id and scheduler (if present). Respond in ${language}.
        CRITICAL RULE 1: The 'riffusionPrompt' MUST remain a comma-separated list of tags.
        CRITICAL RULE 2: DO NOT use the names of specific artists, bands, or songs.
    `;

  if (currentContent.generationMode === 'lyrics') {
    prompt +=
      '\n**CRITICAL RULE 3:** For the lyrics, ensure each section (e.g., [Verse], [Chorus]) is separated by a single blank line.';
  } else {
    // instrumental
    prompt +=
      "\n**CRITICAL RULE 3:** For the instrumental guide in the 'lyrics' field, ensure EVERY descriptive line is enclosed in its own square brackets [] and is on a new line.";
  }

  const response = await ollama.generate({
    model,
    prompt: prompt,
    format: 'json',
  });

  const parsedJson = extractJson(response.response);
  return {
    ...parsedJson,
    id: Date.now().toString(),
    originalIdea: currentContent.originalIdea, // Preserve original idea
    generationMode: currentContent.generationMode,
    parameters: {
      ...parsedJson.parameters,
      seed_image_id: currentContent.parameters.seed_image_id,
      scheduler: currentContent.parameters.scheduler, // Preserve scheduler
    },
  };
};

/**
 * Generates a list of new, random musical ideas.
 * @returns A promise that resolves to an array of string ideas.
 */
export const getNewIdeas = async (): Promise<string[]> => {
  const response = await ollama.generate({
    model,
    prompt:
      "Generate a JSON array of 4 diverse and interesting ideas for a song. Each idea should be a short phrase. Example: 'A blues song about a haunted guitar'.",
    format: 'json',
  });
  return extractJson(response.response);
};

/**
 * Suggests relevant musical tags based on a user's idea.
 * @param idea The user's natural language prompt.
 * @returns A promise that resolves to an array of string tags.
 */
export const suggestTags = async (idea: string): Promise<string[]> => {
  const response = await ollama.generate({
    model,
    prompt: `Given the song idea "${idea}", suggest 5-7 relevant musical tags (like genre, mood, instruments, or concepts). DO NOT use artist names. Respond with a JSON array of strings.`,
    format: 'json',
  });
  return extractJson(response.response);
};

/**
 * A generic function to regenerate a specific part of the creative content.
 * @param context The full current creative content.
 * @param partToRegenerate The key of the content to regenerate (e.g., 'lyrics').
 * @param language The current UI language.
 * @returns A promise that resolves to the newly generated part.
 */
const regeneratePart = async (
  context: GeneratedContent,
  partToRegenerate: string,
  language: string,
): Promise<any> => {
  let specificInstruction = '';
  if (partToRegenerate === 'lyrics') {
    if (context.generationMode === 'lyrics') {
      specificInstruction =
        'Regenerate the song lyrics. Use parentheses () for backing vocals and square brackets [] for structural tags ONLY. Each section must be separated by a blank line.';
    } else {
      specificInstruction =
        'Regenerate the instrumental guide. For the instrumental guide, ensure EVERY descriptive line is enclosed in its own square brackets [] and is on a new line, following a main structural tag like [Intro].';
    }
  } else if (partToRegenerate === 'riffusionPrompt') {
    specificInstruction =
      'Regenerate the prompt as a comma-separated list of tags. DO NOT use artist names.';
  }

  const prompt = `
        A user is creating a song based on the idea: "${context.originalIdea}".
        The current song assets are: ${JSON.stringify(context, null, 2)}.
        Please regenerate ONLY the '${partToRegenerate}' part, making it different but still consistent with the other assets.
        ${specificInstruction}
        Respond in ${language} with a JSON object containing only the new value for '${partToRegenerate}'.
    `;
  const response = await ollama.generate({
    model,
    prompt: prompt,
    format: 'json',
  });
  return extractJson(response.response)[partToRegenerate];
};

/** Regenerates the Riffusion prompt. */
export const regenerateRiffusionPrompt = (c: GeneratedContent, l: string) =>
  regeneratePart(c, 'riffusionPrompt', l);
/** Regenerates the lyrics or instrumental guide. */
export const regenerateLyrics = (c: GeneratedContent, l: string) =>
  regeneratePart(c, 'lyrics', l);
/** Regenerates the song structure string. */
export const regenerateSongStructure = (c: GeneratedContent, l: string) =>
  regeneratePart(c, 'songStructure', l);
/** Regenerates the Riffusion parameters. */
export const regenerateParameters = (c: GeneratedContent, l: string) =>
  regeneratePart(c, 'parameters', l);

/**
 * Gets the system prompt for the Creative Assistant chat feature.
 * @param language The current UI language.
 * @returns The system prompt string.
 */
export const getCreativeChatPrompt = (language: string) => {
  return `You are a Creative Music Assistant. Your goal is to guide the user through a step-by-step process to create a fully-formed song concept. You must communicate in ${language}.

    ${KNOWLEDGE_BASE}

    **Workflow:**
    1.  **Greeting:** Start by introducing yourself and asking for their initial musical idea.
    2.  **Clarify:** Ask clarifying questions about genre, mood, tempo, and instrumentation. For each question, provide 2-4 clickable suggestions using the format [SUGGESTION]Option[/SUGGESTION].
    3.  **Lyrics or Instrumental:** Ask if they want lyrics or an instrumental piece. Guide them down that path.
    4.  **Structure:** Help them define a song structure, again using suggestions.
    5.  **Summarize & Confirm:** Once you have all the details (Idea, Genre, Mood, Instrumentation, Lyrics/Instrumental, Structure), provide a clear, bulleted summary of the concept.
    6.  **Complete:** End your summary message with the exact token [COMPLETE]. This is critical for the app to know the process is finished.

    **Example Interaction:**
    YOU: Hello! I'm your Creative Assistant. What's your musical idea?
    USER: a sad song about the rain
    YOU: That sounds lovely. What genre are you thinking of? [SUGGESTION]Acoustic Folk[/SUGGESTION] [SUGGESTION]Lo-fi Hip Hop[/SUGGESTION] [SUGGESTION]Ambient Piano[/SUGGESTION]
    ...and so on, until...
    YOU:
    Great! Here is the summary of your song concept:
    *   **Idea:** A sad song about rain
    *   **Genre:** Lo-fi Hip Hop
    *   **Mood:** Melancholic, introspective
    *   ...etc.
    If you're happy with this, we can generate the final assets!
    [COMPLETE]

    Begin the conversation now.`;
};

/**
 * Initializes a new chat session with the Creative Assistant.
 * @param language The current UI language.
 * @param history The existing chat history to continue from.
 * @returns A chat instance.
 */
export const startChat = async (
  language: string,
  history: ChatMessage[],
): Promise<(prompt: string) => Promise<string>> => {
  const messages = [
    {
      role: 'system',
      content: getCreativeChatPrompt(language),
    },
    ...history.map(h => ({
      role: h.role,
      content: h.parts[0].text,
    })),
  ];

  return async (prompt: string) => {
    messages.push({ role: 'user', content: prompt });
    const response = await ollama.chat({
      model,
      messages: messages,
    });
    messages.push({
      role: 'assistant',
      content: response.message.content,
    });
    return response.message.content;
  };
};

/**
 * Generates a full set of creative assets from a completed chat conversation.
 * @param chatHistory The history of the conversation.
 * @param language The current UI language.
 * @returns A promise that resolves to the generated content.
 */
export const generateAssetsFromChatHistory = async (
  chatHistory: ChatMessage[],
  language: string,
): Promise<GeneratedContent> => {
  const conversation = chatHistory
    .map(m => `${m.role}: ${m.parts[0].text}`)
    .join('\n');
  const prompt = `
        Based on the following conversation where a user developed a song concept, please generate the final creative assets.
        The final concept is summarized at the end of the conversation.

        Conversation:
        ${conversation}

        Your task is to act as the Muse AI. Convert the final concept from the conversation into the required JSON format.
        Pay close attention to whether the user wanted 'lyrics' or an 'instrumental' guide.
    `;

  // We can reuse the main asset generation function's logic by feeding it a detailed prompt.
  // Let's determine the generation mode from the chat.
  const mode: 'lyrics' | 'instrumental' = conversation
    .toLowerCase()
    .includes('instrumental')
    ? 'instrumental'
    : 'lyrics';

  return generateCreativeAssets(prompt, language, mode);
};

/**
 * Summarizes a block of text.
 * @param text The text to summarize.
 * @returns A promise that resolves to an object containing the text response.
 */
export const summarizeText = async (
  text: string,
): Promise<{ text: string; sources: any[] }> => {
  const prompt = `Provide a detailed summary of the following text:\n\n${text}`;

  const response = await ollama.generate({
    model,
    prompt: prompt,
  });

  return { text: response.response, sources: [] };
};

/**
 * Generates a creative musical idea from a block of research text.
 * @param researchText The text to synthesize.
 * @returns A promise that resolves to a single, descriptive musical idea string.
 */
export const generatePromptFromResearch = async (
  researchText: string,
): Promise<string> => {
  const response = await ollama.generate({
    model,
    prompt: `Based on the following research text, create a single, compelling, and creative musical idea in natural language. This idea will be used in another prompt, so make it descriptive and inspiring.\n\nResearch:\n${researchText}`,
  });
  return response.response.trim();
};

/**
 * Converts a File object to a base64 encoded string.
 * @param file The File to convert.
 * @returns A promise that resolves to a base64 encoded string.
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve((reader.result as string).split(',')[1]);
      } else {
        reject('Failed to read file');
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Analyzes a video file based on a user prompt using a vision model.
 * @param videoFile The video file to analyze.
 * @param prompt The user's instruction for what to analyze.
 * @returns A promise that resolves to the text-based analysis result.
 */
export const analyzeVideo = async (
  videoFile: File,
  prompt: string,
): Promise<string> => {
  const image_data = await fileToBase64(videoFile);

  const response = await ollama.generate({
    model: 'llava',
    prompt: prompt,
    images: [image_data],
  });

  return response.response;
};