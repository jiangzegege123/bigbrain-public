### 1. Consistent Layout Structure

- All pages follow a clean two-level structure: a navigation bar on top and content below.
- Content areas maintain consistent padding and margins for a neat and predictable layout.

### 2. Clear Navigation and Flow

- A fixed navigation bar ensures users can always access logout and move between screens.
- Important actions (like starting a game or creating a new game) are placed at the top and clearly visible.

### 3. Visual Feedback for Actions

- Buttons change color when hovered or focused (using Tailwind's `hover:` and `focus:` utilities).
- Confirmation modals provide explicit feedback before destructive actions (e.g., deleting a game).
- Copy-to-clipboard actions give real-time text feedback ("Link copied!").

### 4. Logical Grouping and Hierarchy

- Related information (like a game's details: name, questions, duration) is grouped together visually in cards.
- Major sections like "Your Games", "Session Results" use clear `<h1>`/`<h2>` headings for document structure.

### 5. Accessible and Meaningful Controls

- All interactive elements use semantic HTML tags like `<button>` or `<a>`.
- Buttons have descriptive labels instead of icon-only actions.
- Form fields are always paired with `<label>` elements for clarity.

### 6. Responsive Design

- The application adapts layouts for mobile, tablet, and desktop screens using Tailwind's responsive classes.
- Grids switch from 1-column on mobile to 2- or 3-columns on larger screens for better readability.

### 7. Immediate and Smooth State Updates

- No page reloads are required to reflect user actions (e.g., creating a game updates the dashboard instantly).
- Smooth modal animations and transitions enhance user experience.

### 8. Error Handling and Validation

- Form inputs validate entries (e.g., password match check during registration).
- Server errors (e.g., login failure) are clearly displayed to users without technical jargon.

### 9. Consistent and Accessible Color Scheme

- High-contrast color schemes are used for text, buttons, backgrounds (e.g., blue on white, red for errors).
- Colors are chosen to meet WCAG 2.1 AA contrast standards.

### 10. Adoption of UI Component Library (shadcn/ui)

- The project uses components from `shadcn/ui` to ensure accessibility, responsiveness, and consistency.
- All components (like Cards, Buttons, Inputs) follow best practices for keyboard accessibility and screen reader support.

### 11. User-Friendly Point System Explanation

- For player scoring, a fair and clear points system is used:
  - Players earn half the question points just by answering correctly.
  - Bonus points depend on how quickly they answer, with quicker answers earning more points.
- This point system is explained clearly to users both during and after the game session.

---

This file covers all major UI/UX design choices made throughout the application to ensure ease of use, accessibility, and an enjoyable experience for all users.
