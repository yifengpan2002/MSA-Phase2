# Context and configuration notes

## Project

Project name: Orbit

Theme: Gamification

Concept: A writing platform where users earn energy through writing, support, and daily activity, then spend energy on collectible planets shown in a personal galaxy.

## Local structure

```text
MSA-Phase2/
  backend/
    Orbit.Api/
    Orbit.Api.Tests/
  frontend/
    src/
    tests/
    public/models/
  specs/
```

## Main frontend routes

```text
/                       Home
/forum                  Forum post list
/forum/:id              Post detail and comments
/login                  Login/register
/profile                Current user's profile
/users/:username        Public user profile
/write                  Write a story
/daily                  Daily reward
/store                  Star store
/galaxy                 Current user's galaxy and leaderboard
/users/:username/galaxy Public user's galaxy
```

## Main backend API routes

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

GET  /api/health
GET  /api/dbcheck
```

## Deployment context

Frontend deployment:

```text
https://msa-phase2-woad.vercel.app
```

Backend deployment:

```text
https://orbit-api-yifeng-grfbbkech2g5drgy.japaneast-01.azurewebsites.net
```

Database:

```text
Neon Postgres
```

## Environment variables to document

Frontend:

```text
VITE_API_URL
```

Backend:

```text
ConnectionStrings__Default
AllowedOrigins
Jwt__Issuer
Jwt__Audience
Jwt__Key
Jwt__ExpiryHours
ASPNETCORE_ENVIRONMENT
```

Do not commit real production secrets to the repository.

## Verification commands

Frontend:

```text
npm test
npm run build
```

Backend:

```text
dotnet test .\Orbit.Api.Tests\Orbit.Api.Tests.csproj -c Test
```

Manual deployment checks:

```text
/api/health
/api/dbcheck
```

