# AI prompt records

This file records representative prompts used during development. The aim is to show planning, debugging, and design collaboration with AI assistance. These are written as prompt summaries.

## 1. Project structure and architecture (planning phase)

Prompt:

> my idea is to create a online writing app. When user login every day, they can receive some points. when they write a story, they will publish the post to a forum where everyone can see. a new user liked on the post will make them receive some energy. and they can use energy to add some strucutre to their 3d planet. List all the tech stacks i should be using and the pages i should develop. (make sure the recommendation are meeting the requirements)

In summary, duing the planning phase, I asked the agent about the tech stacks I should be used. Make sure i am following the requirements of Phase 2 Project before implement any actual code.

## 2. API debugging & development

Prompt:

> The profile page is showing a 500 error when requesting `/api/users/me`. Help identify why the error occurs and what to fix.

> i want to know why this error occur and what to fix

> now, i need to work on the planet display section. u still remember i sent u a sinable planet before? this one is different because we r displaying different planet. the planets i will download from 3d model website.

> Finish the planet display section using multiple downloaded GLB planet models. Preserve the original GLB textures, improve the store preview, and let users inspect their galaxy.

> is there a way i can manipulate my demo account energy? username:demo pass:demo88888. I want to try buy planet

> the graphic is very bad, the big selling pts is it maintain orginal glb. cause it has more textture.

> i have this crytal planet but its is not showing in my galaxy page (even after i purchse it?)

> cottage glb is too big, can i down size it a bit?

> i want to see each glb so i can rewrite their description and name for the planet. can u show me the img for each planet, so I can rewrite those myself?

> I have update the store seederr .cs why the frontend page is also change. it maintain some original copy. and those three planet is not showing in my store page.

> i spot one issue, the galaxy cannot be rotate, the camera looks like fix into one position. when u first create this galaxy page. it can moved but now it cannot moved. maybe its due to the no of planets?

> add some dummy account with some good long post, possible add some comment under it as well. and some planet to those account profile. (around 15 users, and 20posts in total)

## 7. Deployment support

Prompt summary:

> Help prepare the project for deployment using Azure App Service for the backend, Neon Postgres for the database, and Vercel for the frontend. Explain required environment variables and CORS settings.

> i am trying to use neon prosgrep for deployment. will this cause lost everything in current db?

> i tied all different sydney region but it doesnt work.

> how do i deploy backend using Azure extension?
> Purpose:

- Move from local development to deployed app.
- Debug deployment URL, CORS, and database connection problems.

Outcome:

- Configured PostgreSQL connection string.
- Added production environment variable guidance.
- Confirmed backend health and database check endpoints.
- Added frontend environment API URL guidance.

In summary, I wasn't sure how actual deployment works before (i deployed a frontend before, but never do a backend myself) So I was asking AI what are the best free cloud provider that can best help with deployment of the project.

## 8. Testing

Prompt summary:

> Add unit tests for key frontend and backend functionality. Explain the test stack and teach how the API tests work.

Purpose:

- Meet MSA unit testing requirements.
- Verify important logic without relying only on manual testing.

Outcome:

- Added frontend Vitest tests for API wrapper and theme provider.
- Added backend xUnit tests for energy reward rules.
- Explained mocks, fake responses, and request assertions.

Summary:
Most tests are written with the help of AI. I have used Vi-test before in the class project, but thats a while ago and getting rusty in writing those tests. So I was asking AI for couples of examples and then I wrote a couple of them myself.

## 9. Requirement review and documentation

Prompt summary:

> Based on the MSA requirements, check whether the app meets the requirements and create Markdown evidence files for prompts.

Purpose:

- Prepare submission evidence.
- Make AI usage visible and responsible.

Outcome:

- Created this `/specs` folder.
- Added prompt records and context/config notes
