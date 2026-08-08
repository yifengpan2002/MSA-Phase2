# Orbit

Orbit is a full-stack gamified writing platform built for the MSA 2026 Phase 2 Software Stream.

Users can publish stories, read and support other writers, leave comments, earn energy, keep a daily streak, buy collectible planets, and display those planets in a personal galaxy.

## Deployment

- Frontend: [https://msa-phase2-woad.vercel.app](https://msa-phase2-woad.vercel.app)
- Backend API: [https://orbit-api-yifeng-grfbbkech2g5drgy.japaneast-01.azurewebsites.net](https://orbit-api-yifeng-grfbbkech2g5drgy.japaneast-01.azurewebsites.net)
- Scalar API docs: [https://orbit-api-yifeng-grfbbkech2g5drgy.japaneast-01.azurewebsites.net/scalar](https://orbit-api-yifeng-grfbbkech2g5drgy.japaneast-01.azurewebsites.net/scalar)

## Tech stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- MUI
- Zustand
- React Three Fiber / Three.js
- Vitest and React Testing Library

### Backend

- C#
- ASP.NET Core / .NET 10
- Entity Framework Core
- PostgreSQL using Neon
- JWT authentication
- BCrypt password hashing
- Scalar API documentation
- xUnit backend tests

### Deployment

- Frontend deployed on Vercel
- Backend deployed on Azure App Service
- Database hosted on Neon Postgres

## Project theme: Gamification

Orbit follows the gamification theme by turning writing and community interaction into visible progress.

Unlike traditional writing platform, my project has rewarding system which is adding and display their galaxy to other users. My project is unique due to its reward system. Who doesnt want many special planets if they owns a galaxy? All these 3D planet is downlaoded from well-known 3D model createor. The texture of the plants is very appealing if you zoom in to see the detail.

Main gamification features include:

- Daily login streak rewards
- Energy earned from community support
- Star store with purchasable planets
- Personal galaxy display
- Public user profiles and public galaxies
- Galaxy leaderboard

## Interesting features worth highlighting

### 3D planet galaxy

The biggest visual feature is the galaxy page. Purchased planets are displayed as GLB models, which helps preserve the original texture and quality of the downloaded 3D assets.

### Star store

Users can spend earned energy on different planets. The store uses animated previews so users can see the planet before buying it.

## Basic functionality checklist

- User registration
- User login
- JWT-based protected routes
- Create story posts
- View forum posts
- Search posts
- Sort newest/hottest posts
- View post detail pages
- Write comments
- Delete own comments
- Support posts
- Daily energy claim
- Star store
- Buy planets using energy
- View own profile
- View other user profiles
- View own galaxy
- View other user galaxies
- Galaxy leaderboard
- Light/dark theme switching

## API overview

Important backend API routes:

```text
POST /api/auth/register
POST /api/auth/login

GET  /api/posts
POST /api/posts
GET  /api/posts/{id}
POST /api/posts/{id}/support
POST /api/posts/{postId}/comments
DELETE /api/posts/{postId}/comments/{commentId}

GET  /api/users/me
PUT  /api/users/me/avatar
GET  /api/users/me/galaxy
GET  /api/users/{username}
GET  /api/users/{username}/galaxy
GET  /api/users/galaxy/leaderboard

GET  /api/energy/daily
POST /api/energy/daily/claim

GET  /api/store/stars
POST /api/store/stars/{starTypeId}/purchase
```

## Advanced requirements implemented

The three advanced requirements I want marked are:

### 1. Security measures

Authentication protects user-specific actions and private account data. Password hashing is important because even if database data is exposed, raw passwords are not stored.

- JWT authentication and authorization. I use JWT authentication to identify logged-in users. When a user registers or login successfully, the backend creates a signed JWT token and sends it back to the frontend. The frontend stores this token and includes it in later API requests using the Authorization header.
- Password hashing using BCrypt. The api does not store plain text passwords in the database. When a user registers, the backend hashes the password using BCrypt before saving the user account.
- Data validation using DTO validation attributes such as `Required`, `StringLength`, and username format validation.

### 2. State management library

I use Zustand for frontend state management. I initiate the store with create(...). Inside the store, I define both the state values and the functions that update those values.

State stores are used for areas such as:

- Authentication state
- Energy state
- Forum posts
- Post detail data
- Profile data

Zustand keeps shared frontend state organised and avoids passing too many props through unrelated components. This makes the frontend easier to maintain as the app grows.

### 3. Theme switching

Orbit supports light and dark mode. The theme system is handled through a colour mode provider.When the user clicks the theme button, the app switches between two MUI theme objects: one for light mode and one for dark mode. MUI’s ThemeProvider then passes the selected theme to all MUI components, so colours, backgrounds, text, borders, and component styles update consistently across the whole application. Theme switching improves user experience and it also fits the Orbit project because the dark theme supports the space/galaxy atmosphere, while the light theme keeps the rest of the app readable and clean.

## Local setup

```
git clone project_url
```

### Backend

```
cd backend/Orbit.Api
dotnet restore
dotnet run
```

The local backend runs at:

```

http://localhost:5000

```

### Frontend

```
cd frontend
npm install
npm run dev
```

The local frontend usually runs at:

```text
http://localhost:5173
```

## Environment variables for Deployment

### Frontend

```text
VITE_API_URL
```

Example:

```text
VITE_API_URL=https://orbit-api-yifeng-grfbbkech2g5drgy.japaneast-01.azurewebsites.net/api
```

### Backend

```tet
ConnectionStrings__Default
AllowedOrigins
Jwt__Issuer
Jwt__Audience
Jwt__Key
Jwt__ExpiryHours
ASPNETCORE_ENVIRONMENT
```

Secrets such as database passwords and JWT keys should be stored in environment variables or user secrets, not committed directly to the repository.

## Testing

### Frontend tests

```
cd frontend
npm test
```

Frontend tests cover:

- API wrapper request URLs and request bodies
- Register/login API calls
- Auth token headers
- Post creation API calls
- Comment API calls
- Store and planet purchase API calls
- Backend error message handling
- Network failure handling
- Light/dark theme provider behavior

### Backend tests

```
cd backend
dotnet test .\Orbit.Api.Tests\Orbit.Api.Tests.csproj -c Test
```

Backend tests cover:

- Daily energy reward rules
- Daily claim behavior
- Register and login behavior
- Password hashing
- Duplicate username handling
- Post creation validation
- Supporting and withdrawing support from posts
- Comment creation and deletion authorization
- Store planet purchase behavior
- Public profile behavior
- Galaxy leaderboard ranking

## Specs folder

The `/specs` folder contains Markdown evidence of planning, design, AI-assisted development, context/config notes, and prompt records.

Important files:

- `specs/planning&design.md`
- `specs/ai prompts.md`
- `specs/agent instructions.md`
- `specs/context-and-config.md`

## AI usage

AI tools were used during the project for:

- Planning the full-stack app structure
- Debugging API and routing issues
- Improving frontend UI and responsive design
- Preparing deployment to Azure, Vercel, and Neon
- Writing and explaining frontend/backend tests

AI-generated suggestions were reviewed and adjusted during development.

## Self-reflection

If I were to do this project again, I would plan the data model and deployment setup earlier. Some issues, especially moving from SQLite/local development to Neon PostgreSQL and Azure deployment, took extra time because they affected migrations, connection strings, CORS, and environment variables.

I should think about more interactive features and start working on the project earlier. Those features are coming into my mind during development, but I couldn't implement them due to time limit. Such as planet trading/giving feature. User messaging feature using web Socket and maybe another feature is you can create a default planet but the store allow the user to put random structures onto the planet etc...
