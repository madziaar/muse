# AI & Prompting Guide

Understanding how to communicate with the AI is key to unlocking the full potential of Riffusion Muse. This guide provides tips and best practices for writing effective prompts.

## The Core Concept: From Idea to Assets

The central purpose of the AI in the **Muse** tab is to act as an expert translator. It takes your high-level, descriptive musical idea and deconstructs it into the specific, machine-readable assets that a model like Riffusion needs to generate music.

- **Your Input:** A natural language sentence rich with creative detail.
- **AI Output:** A structured set of data, including:
  - **A comma-separated list of tags** (`riffusionPrompt`)
  - **A lyrical or instrumental guide** (`lyrics`)
  - **A defined song structure** (`songStructure`)
  - **A set of technical parameters** (`parameters`)

## How to Write an Effective Prompt

The quality of your input directly impacts the quality of the AI's output. Here are some tips:

### 1. Be Descriptive and Evocative
Instead of just stating a genre, describe the feeling you want to evoke.

- **Good:** `"A melancholic, hopeful synthwave track for a lonely drive through a neon-lit city at night."`
- **Less Effective:** `"A synthwave song."`

The first example gives the AI much more to work with regarding mood (`melancholic`, `hopeful`), setting (`lonely drive`, `neon-lit city`), and instrumentation (`synthwave`).

### 2. Combine Genres and Styles
Don't be afraid to mix and match. The AI can understand complex stylistic blends.

- **Example:** `"An upbeat, funky disco track with a classic rock guitar solo."`
- **Example:** `"A dark, orchestral trap beat with cinematic string arrangements."`

### 3. Specify Instrumentation
If you have specific instruments in mind, include them. This helps the AI select the right tags for the Riffusion prompt.

- **Example:** `"A gentle acoustic folk song featuring fingerpicked guitar, a soft violin melody, and light hand percussion."`

### 4. Use the Right Tool for the Job
- **For a guided experience:** Use the **Creative Assistant**. It's designed to help you build a detailed prompt through conversation.
- **For direct control:** Use the **Muse** tab when you have a clear, well-formed idea.
- **For discovery:** Use the **Explorer** to find new tags and build a prompt from scratch.
- **For external inspiration:** Use the **Researcher** and **Analyzer** to generate ideas from topics or videos.

## A Note on Safety
To ensure compatibility with Riffusion's safety filters, the AI is strictly instructed **not to use the names of specific artists, bands, or songs**.

- **Do this:** `"A fast, aggressive punk rock song in the style of late 70s British punk."`
- **Don't do this:** `"A song that sounds like the Sex Pistols."`

By focusing on descriptive qualities rather than proper names, you'll get better and more reliable results.
