# Riffusion Muse Project Roadmap

This document outlines the future development plans for the Riffusion Muse application. Our goal is to evolve the tool into an indispensable part of the AI-assisted music creation workflow.

---

## ✅ Phase 1: Enhanced Creativity & Control (Completed)

This phase focused on giving the user more granular control over the AI's output and improving the creative workflow.

-   **[x] Negative Prompts:** Add a dedicated input field for "negative tags" to specify elements the AI should actively avoid in its generation.
-   **[x] Save/Load Session:** Implement functionality to export the current session (idea, history, parameters) to a local JSON file and import it back, allowing users to save their work.
-   **[x] Advanced Parameter Control:** Expose more Riffusion parameters for expert users, such as `scheduler` and `seed`.
-   **[x] "Copy All" Button:** Add a button to copy all generated assets to the clipboard in a single, formatted block.
-   [x] **Persist User Settings:** Save preferences like the selected language and active tab in `localStorage`.

---

## 🚀 Phase 2: Collaboration & Workflow Integration (Current Focus)

This phase is about connecting the user's creations with the outside world and streamlining the workflow from our app to other platforms.

-   **[ ] Shareable Links:**
    -   **Goal:** Allow users to share their complete creative concepts via a single URL.
    -   **Implementation:** Use a library like `lz-string` to compress the `GeneratedContent` JSON object into a compact, URL-safe string. Append this string to the URL as a hash. The application will check for this hash on load, decompress the data, and restore the shared state.
-   **[ ] Export to Markdown:**
    -   **Goal:** Provide a clean, portable way to save and share individual creations.
    -   **Implementation:** Add an "Export to Markdown" button on the Muse tab that generates and triggers a download of a `.md` file. The file will be formatted with clear headings for the Riffusion Prompt, Lyrics/Guide, Structure, and Parameters.
-   **[ ] Riffusion Parameter Presets:**
    -   **Goal:** Allow users to save and quickly apply their favorite sets of technical parameters.
    -   **Implementation:** Create a UI in the "Advanced Parameters" section to save the current parameters with a custom name (e.g., "Crisp Synthwave Drums", "Ambient Pad Settings"). Store these presets in `localStorage`. Add a dropdown menu to load a saved preset, instantly updating the sliders and inputs.
-   **[ ] Direct Riffusion Integration (Labs Feature):**
    -   **Goal:** Tighten the loop between idea generation and audio creation.
    -   **Implementation:** Investigate Riffusion's URL schema. If it supports passing prompt data via query parameters, add a "Preview in Riffusion" button that opens `riffusion.com` in a new tab with the prompt and parameters pre-filled.

---

## 🚀 Phase 3: Advanced AI & Musicality

This phase focuses on leveraging more advanced AI capabilities to transform the app from a prompt generator into a comprehensive songwriting partner.

-   **[ ] Lyrical Style Analysis Tool:**
    -   **Goal:** Create a tool that can analyze existing lyrics to inspire new creations.
    -   **Implementation:** Build a new feature where a user can paste lyrics. The AI will analyze the text to identify its lyrical style (e.g., Narrative, Abstract), detect the rhyme scheme (AABB, ABAB), and suggest a fitting musical mood and instrumentation, effectively reverse-engineering a song's creative DNA.
-   **[ ] Chord Progression Suggestions:**
    -   **Goal:** Bridge the gap between lyrical ideas and musical composition.
    -   **Implementation:** Enhance the main Muse generation output. Based on the generated mood and genre, the AI will suggest 1-2 common and thematically appropriate chord progressions (e.g., `Am - G - C - F` for a melancholic pop song), providing a tangible starting point for songwriting.
-   **[ ] Thematic Cohesion Analyzer:**
    -   **Goal:** Help users create more thematically consistent prompts and lyrics.
    -   **Implementation:** Add a new "Analyze Cohesion" button in the Muse tab. The AI will review the generated `riffusionPrompt` and `lyrics` together, providing feedback on their consistency. For example: "Your prompt mentions '80s synthwave', but your lyrics have a very modern, introspective feel. Consider adding more retro-futuristic imagery to the lyrics to strengthen the theme."
-   **[ ] AI-Powered Rhyming Dictionary & Thesaurus:**
    -   **Goal:** Integrate a powerful writing assistant directly into the workflow.
    -   **Implementation:** Within the "Refine" feature, allow the user to select a word in their generated lyrics. The AI will then provide a context-aware list of rhymes, near-rhymes, and synonyms that fit the song's established mood and theme.

---

## 🚀 Phase 4: Platform & Ecosystem (Long-Term Vision)

This phase outlines the long-term vision of growing Riffusion Muse from a standalone tool into a collaborative platform.

-   **[ ] Community Library:**
    -   **Goal:** Create a space for users to share and discover creations.
    -   **Implementation:** Develop a backend (e.g., Firebase, Supabase) to store user-submitted `GeneratedContent` objects. The UI will feature a public, browsable gallery where users can view, "like," and "remix" (load into their own Muse tab) creations from the community.
-   **[ ] User Accounts:**
    -   **Goal:** Enable personalization and persistence across devices.
    -   **Implementation:** Add a simple authentication system. User accounts would allow for saving parameter presets to the cloud and contributing to the Community Library.
-   **[ ] Plugin Architecture:**
    -   **Goal:** Make the application extensible and future-proof.
    -   **Implementation:** Refactor the application's architecture so that new AI services or "analyzers" (like the chord progression or lyrical analysis tools) can be added as self-contained plugins without requiring major rewrites of the core UI.
