import { Box, Container, Divider, Stack, Typography } from "@mui/material";

import planetBanner from "../assets/planet-banner.png";

export function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
      }}
    >
      <Box component="main" sx={{ flex: 1 }}>
        {/* Hero banner */}
        <Box
          component="section"
          sx={{
            minHeight: { xs: 460, sm: 560, md: 650 },
            display: "flex",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#050035",
            backgroundImage: `
              linear-gradient(
                90deg,
                rgba(5, 0, 53, 0.94) 0%,
                rgba(5, 0, 53, 0.72) 42%,
                rgba(5, 0, 53, 0.18) 100%
              ),
              url(${planetBanner})
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Container maxWidth="lg">
            <Stack
              spacing={2.5}
              sx={{
                maxWidth: 650,
                position: "relative",
                zIndex: 1,
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  color: "#8edbc6",
                  fontSize: 12,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                Orbit Writing Community
              </Typography>

              <Typography
                component="h1"
                sx={{
                  maxWidth: 620,
                  color: "#f5f6f1",
                  fontFamily: '"Newsreader", Georgia, serif',
                  fontWeight: 400,
                  fontSize: {
                    xs: "3rem",
                    sm: "4.5rem",
                    md: "5.5rem",
                  },
                  lineHeight: 0.98,
                  letterSpacing: "-0.035em",
                }}
              >
                Explore a secret place among the universe
              </Typography>

              <Typography
                sx={{
                  maxWidth: 510,
                  color: "rgba(245, 246, 241, 0.78)",
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  lineHeight: 1.75,
                }}
              >
                Every story creates energy. Every new idea helps your world
                grow.
              </Typography>
            </Stack>
          </Container>

          <Box
            aria-hidden="true"
            sx={{
              position: "absolute",
              inset: "auto 0 0",
              height: 120,
              background:
                "linear-gradient(180deg, rgba(5, 0, 53, 0), rgba(5, 0, 53, 0.55))",
            }}
          />
        </Box>

        {/* About section */}
        <Box
          component="section"
          sx={{
            py: { xs: 8, md: 12 },
            backgroundColor: "background.default",
          }}
        >
          <Container maxWidth="md">
            <Stack spacing={3}>
              <Typography
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  color: "primary.main",
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                About the project
              </Typography>

              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontSize: { xs: "2.4rem", md: "3.5rem" },
                  lineHeight: 1.08,
                }}
              >
                A creative universe built one story at a time.
              </Typography>

              <Divider />

              <Typography
                color="text.secondary"
                sx={{
                  maxWidth: 760,
                  fontSize: { xs: "1rem", md: "1.15rem" },
                  lineHeight: 1.9,
                }}
              >
                Orbit is an online writing community where users can return each
                day to receive points, publish original stories, and connect
                with other writers and readers. When a new reader likes a story,
                the writer receives energy. That energy can then be used to add
                new structures to a personal 3D planet, allowing every
                user&apos;s world to grow alongside their creative progress.
              </Typography>
            </Stack>
          </Container>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          backgroundColor: "background.paper",
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr auto 1fr",
              },
              alignItems: "center",
              rowGap: 1.5,
              columnGap: 4,
              textAlign: {
                xs: "center",
                md: "initial",
              },
            }}
          >
            <Typography
              sx={{
                justifySelf: {
                  xs: "center",
                  md: "start",
                },
                fontFamily: '"Newsreader", Georgia, serif',
                fontSize: "1.8rem",
                lineHeight: 1,
              }}
            >
              Orbit
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                justifySelf: "center",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                whiteSpace: {
                  xs: "normal",
                  sm: "nowrap",
                },
              }}
            >
              Write - Earn energy - Build your world
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                justifySelf: {
                  xs: "center",
                  md: "end",
                },
                fontSize: 13,
              }}
            >
              (c) 2026 Orbit
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
