# Riffusion Muse - TODO List

This file tracks the upcoming tasks, improvements, and bug fixes for the project. A fresh analysis has been performed to identify the next most impactful areas for development.

---

### 🚀 New Features (In Progress)

-   [ ] **Unified Generation Output Modes:**
    -   Replace the current `Lyrics`/`Instrumental` toggle with a single dropdown/radio button group for "Output Style" with three distinct options:
        1.  **`Advanced (Sound + Lyrics)`:** This will be the new default. It will generate two separate fields: a `Sound Prompt` (comma-separated tags) and a `Lyrics Prompt` (containing lyrics or an instrumental guide).
        2.  **`Simple (Paragraph Prompt)`:** This mode will generate a single, descriptive paragraph combining the musical idea, mood, and instrumentation. This is designed for Riffusion's simple/single-prompt input.
        3.  **`Instrumental (Sound + Guide)`:** This mode will function like the current Instrumental mode, generating a `Sound Prompt` and a detailed instrumental guide for the `Lyrics Prompt`.
    -   Update the `geminiService.ts` to include new functions and schemas to handle these different output structures.
    -   Refactor the `Muse.tsx` UI to incorporate this new selection logic and conditionally display the correct result cards based on the selected mode.

---

### ✨ UI/UX Polish

-   [ ] **Researcher Source Display:**
    -   Instead of a simple list of links, display each source in the `Researcher` tab as a styled card with the title and a clickable URI for a cleaner presentation.
-   [ ] **Responsive Visual Structure:**
    -   Improve the responsive styling of the `VisualStructure` component so that the flowchart elements wrap more gracefully into multiple lines on narrow mobile screens.
-   [ ] **History Dropdown Clarity:**
    -   Add a timestamp (e.g., "10:45 AM") to each entry in the history dropdown in the `Muse` tab to make it easier to distinguish between different generations from the same session.

---

### 💻 Code Refinements & Chores

-   [ ] **Workspace Cleanup:**
    -   The `up/` directory contains knowledge base files that have now been fully integrated into the AI's system prompts in `geminiService.ts`. These files are redundant and should be deleted to clean up the project root.
-   [ ] **Review Component Memoization:**
    -   Analyze component re-renders using React DevTools and apply `React.memo` to any other purely presentational child components that could benefit from it, further optimizing UI performance.
