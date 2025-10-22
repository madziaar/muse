# Features Deep Dive

This document provides a comprehensive overview of each feature and tab within the Riffusion Muse application.

---

## 1. Muse Tab (The Core Generator)

The Muse tab is the central workspace where your musical ideas are transformed into concrete assets.

- **Musical Idea Input:** The main textarea where you describe your concept. The AI analyzes this text to generate all other assets.
- **Generation Mode Toggle:**
  - **Lyrics:** Instructs the AI to generate sung lyrics, complete with structural tags like `[Verse]` and `[Chorus]`.
  - **Instrumental:** Instructs the AI to generate a descriptive, step-by-step guide for an instrumental piece, using tags to define sections and descriptive text to guide the mood and instrumentation.
- **Structure Templates:** A library of common song structures (e.g., Pop, EDM, Cinematic) that you can select to provide a clear arrangement for the AI to follow.
- **Advanced Parameters:** An accordion section containing:
  - **Negative Prompt:** An input for tags you want the AI to actively avoid.
  - **Scheduler & Seed:** Advanced Riffusion settings for expert users to control the generation algorithm and ensure reproducible results.
- **Result Cards:**
  - **Riffusion Prompt:** A comma-separated list of tags for Riffusion's "Sound" tab.
  - **Lyrics / Instrumental Guide:** The generated text for Riffusion's "Lyrics" tab.
  - **Song Structure:** A visual flowchart representing the song's arrangement.
  - **Parameters:** Interactive sliders for fine-tuning `denoising`, `prompt_strength`, and `num_inference_steps`.
- **Core Actions:**
  - **Generate:** Kicks off the main generation process.
  - **Refine:** Allows you to provide follow-up instructions to modify the entire generated result.
  - **History Dropdown:** Lets you access and switch between your last 5 generations.
  - **Save/Load Session:** Export your current session (including history) to a JSON file and import it later.
  - **Copy All:** Copies all generated assets to your clipboard in a formatted block.

---

## 2. Creative Assistant (Guided Workflow)

This tab provides a guided, conversational experience for building a song concept from the ground up.

- **Conversational UI:** A chat interface where you interact with an AI creative partner.
- **Step-by-Step Guidance:** The AI proactively asks questions to help you define your idea, genre, mood, instrumentation, and structure.
- **Clickable Suggestions:** The AI provides handy, clickable suggestions to speed up the process.
- **Final Handoff:** Once the concept is complete, the AI generates all the final assets and provides a **"Send to Muse"** button to transfer the result to the main Muse tab.

---

## 3. Explorer Tab (Discovery Tool)

The Explorer tab is designed for discovery and prompt building.

- **Your Prompt Box:** A staging area where you can build a prompt by selecting tags and genres.
- **Tag Finder:** A powerful search bar that lets you find specific tags (instruments, moods, styles) from a library of over 2,000 options.
- **Genre Explorer:** A browsable list of musical genres and their subgenres.
- **Send to Muse:** Once you've built your prompt, this button sends the comma-separated list of tags to the Muse tab to kickstart a generation.

---

## 4. Researcher Tab (Inspiration Engine)

This tab uses Google Search grounding to help you find inspiration from real-world topics.

- **Research Input:** Enter any topic you want to learn about for creative inspiration.
- **AI-Powered Summary:** The Gemini model researches the topic and provides a concise, detailed summary.
- **Cited Sources:** The summary includes links to the web sources used, allowing you to dig deeper.
- **Generate Prompt from Research:** After the research is complete, you can click a button to have the AI analyze the text and generate a descriptive, natural-language musical idea inspired by it. This idea can then be sent to the Muse tab.

---

## 5. Analyzer Tab (Video-to-Soundtrack)

This tab helps you brainstorm soundtrack ideas by analyzing video content.

- **Video Upload:** Upload a video file (up to 50MB).
- **Analysis Prompt:** Provide instructions for the AI, telling it what to look for in the video (e.g., "describe the mood and pacing," "suggest a genre for a soundtrack").
- **AI Analysis:** The Gemini vision model analyzes the video frames and your prompt to generate a text-based result.
- **Send to Muse:** The text result can be sent directly to the Muse tab to serve as the basis for a new song generation.
