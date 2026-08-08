# AI agent instructions and development constraints

These instructions describe how AI assistance was used during the development of Orbit.

## General working style

- Inspect existing project files before suggesting changes.
- Prefer small, focused changes instead of replacing large files blindly.
- Explain why a change is needed, especially when fixing bugs.
- Preserve the user's existing design direction and naming choices.
- Avoid overwriting unrelated work.

## Frontend instructions

- Use React with TypeScript.
- Keep the UI visually aligned with the planet/space theme.
- Maintain responsive layouts for desktop and mobile.
- Use React Router routes already present in the app.
- Use the existing API wrapper in `frontend/src/api/api.ts`.

## Backend instructions

- Use ASP.NET Core controllers and EF Core.
- Keep protected user actions behind JWT authentication.
- Use clear DTOs for API request/response shapes.
- Do not trust frontend-only validation for important operations such as purchases.
- Keep Scalar API documentation available for API testing.
- Use database migrations rather than manually editing the production database schema.

## Testing instructions

- Add tests for key behavior rather than testing only rendering details.
- For frontend API tests, mock `fetch` so the tests verify request construction and error handling without requiring the backend to run.
- For backend unit tests, test business rules such as daily energy rewards and support reward values.
- Run tests after meaningful changes.

## Deployment instructions

- Keep secrets out of committed files.
- Use environment variables for production API URL, JWT settings, CORS origins, and database connection string.
- Confirm deployment using `/api/health` and `/api/dbcheck`.
- Keep frontend and backend deployment URLs documented in README before final submission.
