# Riffusion Muse 🎶

### Your AI partner for musical inspiration.

Riffusion Muse is an advanced creative tool designed to help musicians, producers, and hobbyists brainstorm and develop musical ideas. It leverages the power of the Google Gemini API to transform natural language concepts into a complete set of Riffusion-ready assets, including prompts, lyrics, song structures, and technical parameters.

<!-- Add a screenshot of the main UI here -->

## 📚 Documentation

For a complete guide to all features, AI prompting tips, and developer information, please see the **[full documentation in the /docs folder](./docs/index.md)**.

## ✨ Key Features

- **Muse Tab (Core Generator):**
  - **Natural Language to Tags:** Converts your descriptive ideas (e.g., "a sad synthwave song for a rainy night") into a comma-separated list of tags optimized for Riffusion's sound generation.
  - **Lyrics & Instrumental Modes:** Toggle between generating creative song lyrics or a detailed, descriptive guide for an instrumental piece.
  - **Iterative Refinement:** Refine and regenerate individual parts of your creation (prompt, lyrics, structure, or parameters) without losing the parts you like.
  - **Interactive Controls:** Fine-tune technical parameters with interactive sliders and get real-time tag suggestions as you type.
  - **Generation History:** Automatically saves your last five creations, allowing you to easily switch between them.
  - **Structure Templates:** Kickstart your song with a library of common song structures organized by genre.

- **Creative Assistant (Chat Tab):**
  - An AI-guided, step-by-step workflow that acts as a creative partner. The assistant asks clarifying questions about genre, mood, and structure, provides clickable suggestions, and helps you build a complete song concept from scratch before generating the final assets and sending them to the Muse.

- **Explorer Tab:**
  - An interactive library of over 2,000 musical tags and a browsable hierarchy of genres. Click to build a prompt and send it directly to the Muse.

- **Researcher Tab:**
  - Uses Google Search grounding to research any topic for musical inspiration (e.g., "Viking mythology," "the atmosphere of Mars") and generates a creative prompt from the findings.

- **Analyzer Tab:**
  - Upload a video file and provide a prompt to get AI-powered suggestions for a fitting soundtrack, analyzing the mood, pacing, and visuals.

- **Multilingual Support:**
  - Fully translated UI and AI interaction available in English and Polish, while keeping Riffusion-specific outputs in English for compatibility.

## 🛠️ Technology Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **AI Model:** Google Gemini API (`gemini-2.5-flash` for speed, `gemini-2.5-pro` for vision tasks)
- **Core Dependencies:** `@google/genai`, `react-markdown`

## 🚀 How to Use

1.  **Get Guided Help (Recommended):** Start in the **Creative Assistant** tab. The AI will walk you through building your idea step-by-step and then send the completed concept to the Muse.
2.  **Or Start Manually:** Go to the **Muse** tab and describe your musical concept in the main text box.
3.  **Choose Your Mode:** Select whether you want **Lyrics** or an **Instrumental Guide**.
4.  **Generate:** Click the "Generate" button. The AI will provide a Riffusion Prompt, Lyrics/Guide, Structure, and Parameters.
5.  **Refine (Optional):** Use the "Refine" button to give the AI further instructions (e.g., "make it more energetic"), or regenerate individual parts using the refresh icon on each card.
6.  **Use in Riffusion:** Copy the generated assets and use them in the Riffusion web UI to create your music.

## 🗺️ Future Development

For a detailed look at upcoming features and the long-term vision for the project, see the [ROADMAP.md](ROADMAP.md) file.