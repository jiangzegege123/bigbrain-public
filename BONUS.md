## Redirect Based on Login State

- Implemented redirection logic to improve UX and ensure correct routing:
  - If the user is already logged in, visiting `/login` or `/register` will redirect to `/dashboard`
  - If the user is not logged in, visiting protected routes like `/dashboard`, `/game/:id` will redirect to `/login`
- This prevents redundant login/registration and enforces access control across the app.
- Achieved using AuthContext + `Navigate` in route-level checks.
