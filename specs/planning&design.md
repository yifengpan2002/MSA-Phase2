# Planning and design notes

## Project concept

Orbit is a gamified writing and reading web application. Users write posts, read community stories, support other writers, collect energy, and spend that energy in a star store to buy planets. Purchased planets appear in each user's galaxy.

The core design idea is that writing and community interaction should feel visible and rewarding. Instead of using a simple points counter only, the app turns user progress into a personal galaxy. They can buy different unique planet to create their own galaxy. This should be matching the theme gamification.

## Target users

- Writers who want a lightweight place to publish short stories or journal-style posts.
- Readers who want to discover and support writing from other users.
- Users who enjoy progression systems such as streaks, collectibles, and leaderboards.

## Main user flow

1. A visitor registers or logs in.
2. The user writes a story and publishes it to the forum.
3. Other users can search, sort, read, comment on, and support stories.
4. Support gives energy to the story author.
5. Users can claim daily streak energy.
6. Users spend energy in the star store.
7. Purchased planets appear in the user's galaxy.
8. Users can view other writers' profiles and galaxies.

## Design decisions

- The app uses a planet/space visual identity to make gamification feel central rather than decorative.
- The galaxy view uses GLB models so planets keep their original 3D texture and visual character. (since this is the more attractive part, we dont want to lower the texture of planet so we use largest glb as possible, maintain all the quality of the 3D model but try not to overload the browser)
- The store uses animated planet previews to help users understand what they are buying.
- Light and dark themes use the same planet-inspired colour palette.
- The default theme is dark because it suits the space concept and makes the galaxy display more atmospheric.
- Public profiles encourage discovery by letting users click avatars/names and view another writer's galaxy.

## Architecture overview

```text
React + TypeScript frontend
  - React Router pages
  - MUI interface components
  - Zustand state stores
  - Three.js / React Three Fiber galaxy and planet previews
  - Vitest frontend tests

.NET backend API
  - ASP.NET Core controllers
  - EF Core data access
  - PostgreSQL database through Neon
  - JWT authentication
  - Scalar API documentation
  - xUnit backend tests

Deployment
  - Frontend on Vercel
  - Backend on Azure App Service
  - Database on Neon Postgres
```

## Pages and Component (Figma)

![Low fidelity prototype](<assets/Pages and Component (Figma)/low-fidelity-prototype.png>)

![Login](<assets/Pages and Component (Figma)/login.png>)

![Forum](<assets/Pages and Component (Figma)/forum.png>)

![Detailed post](<assets/Pages and Component (Figma)/detailed post.png>)

![Profile page](<assets/Pages and Component (Figma)/profile page.png>)

## Key entities

- User - account, profile, avatar, energy, streak data.
- Post - story title/body, author, support count, comments.
- Comment - discussion under a post.
- Support - reader support for a post, used to reward the author.
- StarType - purchasable planet definition.
- OwnedStar - planet owned by a user.

## Future improvements

- Add lazy loading/code splitting for 3D pages to reduce frontend bundle size.
- Add richer moderation/admin tools.
- Add more user interaction like user conversation channel, planet trading system and user freedom activity like placing their own object on the planet or navigate nerghbour galaxy.
