# The Odin Project: React Memory Card Game (Timberborn Edition)

## Project Core Philosophy

- **Goal**: Focus 100% on learning React concepts (state management, hooks, side effects, data flow) rather than over-engineering UI/CSS.
- **The Twist**: Connect the React app via an external HTTP API directly to a live running copy of the video game _Timberborn_ using the "More HTTP API" local mod.

---

## Technical Discovery & Data Specs

- **Target Endpoint**: `http://localhost:8080/characters`
- **Data Flow Plan**: Fetch data exactly once when the component mounts using a `useEffect` hook with an empty dependency array (`[]`).
- **Intercepted JSON Structure**:
  An array of character objects, each containing:
  - `Name`: (e.g., "Jalali", "Sodamat") -> To use as the unique card identifier.
  - `ImagePath`: (e.g., `"Sprites/Avatars/IronTeethAdult..."`) -> Potential future path for visual avatars.

---

## Component Architecture

Separation of concerns isolated into a flat, lean hierarchy:

1. **`App` (The Brain)**: Holds all gameplay states, manages lifecycle effects, handles click conditions, controls game score comparison, and conducts shuffling execution.
2. **`Header` (Presentation)**: Simple container layout holding static instructions/title and reading score states to display them.
3. **`GameContainer` (Layout & Dynamic Switch)**: A wrapper element acting as a layout switchboard based on current state variables:
   - **Loading/Error States**: Rendered if the API fails or is fetching.
   - **Gameplay State**: Maps over data arrays into individual `Card` elements in a clean CSS grid layout.
   - **Game Over Modal Overlay**: Appears instantly if `isGameOver` is true, keeping game context frozen below it.
4. **`Card` (Reusable Component)**: Individual clickable tiles capturing target identifiers on click events.

---

## State Architecture (`App.jsx`)

- `beavers` (`useState([])`): Stores array list of game characters.
- `currentScore` (`useState(0)`): Number of unique correct cards clicked this cycle.
- `highScore` (`useState(0)`): Peak score tracked dynamically or on completion thresholds.
- `clickedBeavers` (`useState([])`): Immutably updated collection array storing character IDs already chosen.
- `isGameOver` (`useState(false)`): Boolean flag explicit conditional toggle showing/hiding the endgame modal.

---

## Game Loop Logic Flow

1. **Card Clicked (`handleCardClick`)**:
   - Intercept click handler -> check if name exists inside `clickedBeavers` array using `.includes()`.
   - **If duplicate**: Check if `currentScore > highScore` and update if true. Trigger `isGameOver(true)` to reveal the modal. Keep scores frozen on screen for the modal to display.
   - **If unique**: Append target ID immutably using array spreading (`setClickedBeavers([...clickedBeavers, cardId])`). Step up current score by 1, immediately sync `highScore` if target record is broken, and execute the array shuffling sequence.
2. **Play Again Triggered (`resetGame`)**:
   - Clear out `clickedBeavers` array to `[]`.
   - Reset `currentScore` back to `0`.
   - Toggle `isGameOver(false)` to slide away the modal and unlock layout interactions.
