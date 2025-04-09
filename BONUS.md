## Redirect Based on Login State

- Implemented redirection logic to improve UX and ensure correct routing:
  - If the user is already logged in, visiting `/login` or `/register` will redirect to `/dashboard`
  - If the user is not logged in, visiting protected routes like `/dashboard`, `/game/:id` will redirect to `/login`
- This prevents redundant login/registration and enforces access control across the app.
- Achieved using AuthContext + `Navigate` in route-level checks.

### Logo Navigation

**Description:**  
I implemented a feature where clicking on the site logo takes the user back to the dashboard (`/dashboard` route). This improves user experience by providing a fast and intuitive way to return to the main screen.

**Where it is implemented:**  
This feature is added to the `Navbar` component. The logo is wrapped in a `Link` component that points to `/dashboard`.

**Why it's useful:**

- Users often rely on the logo to return to the homepage/dashboard.
- This behavior is common in professional applications and websites.
- Enhances usability and navigation without needing a separate button.
