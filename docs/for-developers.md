# For Developers

This document provides a technical overview of the Riffusion Muse project, intended for developers who want to understand, contribute to, or extend the application.

## Project Structure

The codebase is organized into logical directories to ensure a clean separation of concerns.

- **`/components`**: Contains reusable, presentational React components that are shared across multiple features (e.g., `ResultCard`, `Accordion`, `Tabs`). These components should be stateless or have minimal UI-related state.

- **`/features`**: Contains the primary feature components of the application, each corresponding to a main tab (e.g., `Muse`, `Explorer`, `Chat`). These are the "smart" components that manage state, handle user interactions, and call services.

- **`/contexts`**: Holds React Context providers for managing global state.
  - `AppContext.tsx`: Manages application-wide state like toast notifications and the active tab.
  - `LanguageContext.tsx`: Manages the current UI language (English/Polish).

- **`/hooks`**: Contains custom React hooks that encapsulate reusable logic.
  - `useAppContext.ts`: A simple consumer for the `AppContext`.
  - `useTranslation.ts`: Handles the internationalization (i18n) logic.
  - `useDebounce.ts`: A utility hook to delay processing of rapidly changing values.
  - `useGenerationHistory.ts`: Encapsulates the complex state logic for the Muse's generation history.

- **`/services`**: The communication layer with external APIs.
  - `geminiService.ts`: This is the core of the application's AI logic. It contains all functions for interacting with the Google Gemini API, including constructing system prompts, parsing responses, and handling different generation tasks.

- **`/lib`**: A directory for shared library code, constants, and utilities.
  - `translations.ts`: Stores the string maps for English and Polish.
  - `constants.ts`: Centralizes "magic numbers" like debounce delays and history limits.

- **`/types.ts`**: Defines shared TypeScript types and interfaces used throughout the application.

## State Management

The application uses a hybrid approach to state management:

1.  **Global State (React Context):**
    - The `AppContext` is used for truly global state that needs to be accessed by many disconnected components (e.g., the toast notification system).
    - The `LanguageContext` manages the i18n state.
    - This approach avoids "prop drilling" for widely used state.

2.  **Feature-Level State (`useState`, `useReducer`):**
    - Most state is managed locally within the primary feature components in the `/features` directory.
    - Complex state within a feature (like in `Muse.tsx`) is often managed by custom hooks (`useGenerationHistory`) to keep the main component body clean and focused on rendering.

## Internationalization (i18n)

The application is fully translated into English and Polish.

- The text for both languages is stored in the `lib/translations.ts` file.
- The `LanguageContext` provides the currently selected language to the entire component tree.
- The `useTranslation` hook consumes this context and provides a `t` function.
- The `t` function takes a key and returns the appropriate string for the current language. It can also interpolate dynamic values into the string (e.g., `t('greeting', { name: 'User' })`).

To add a new translated string, simply add the key and its value to both the `en` and `pl` objects in `lib/translations.ts`.
