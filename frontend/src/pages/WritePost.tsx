import { useState, type FormEvent } from "react";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import { api } from "../api/api";
import { useAuthStore } from "../store/useAuthStore";

const TITLE_LIMIT = 120;
const BODY_LIMIT = 20000;

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}

export function WritePost() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Publishing requires a token, so don't let people write and then lose it.
  if (!token) return <Navigate to="/login" replace />;

  const canPublish = title.trim().length > 0 && body.trim().length > 0;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!canPublish) {
      setError("Title and story body are required.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const post = await api.createPost({
        title: title.trim(),
        body: body.trim(),
      });
      navigate(`/forum/${post.id}`);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Failed to publish story.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        py: { xs: 4, md: 6 },
        backgroundColor: "background.default",
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <Stack spacing={2}>
            <Link
              component={RouterLink}
              to="/forum"
              underline="hover"
              color="text.secondary"
              sx={{
                width: "fit-content",
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                fontSize: 14,
              }}
            >
              <ArrowBackOutlinedIcon fontSize="small" />
              Back to forum
            </Link>

            <Box>
              <Typography
                variant="h1"
                component="h1"
                sx={{ fontSize: { xs: "3rem", md: "4rem" }, mb: 0.75 }}
              >
                Write a story
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ maxWidth: 700, fontSize: { xs: "1rem", md: "1.08rem" } }}
              >
                Share a new story with the community and let your creative
                universe grow.
              </Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 310px" },
              gap: { xs: 3, lg: 3.5 },
              alignItems: "start",
            }}
          >
            <Paper
              component="section"
              variant="outlined"
              sx={{
                p: { xs: 2.5, sm: 3.5, md: 4 },
                borderColor: "divider",
                backgroundColor: "background.paper",
              }}
            >
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: '"JetBrains Mono", monospace',
                        color: "primary.main",
                        fontSize: 12,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        mb: 1,
                      }}
                    >
                      Story details
                    </Typography>

                    <Typography variant="h2" sx={{ fontSize: "2rem" }}>
                      Create your next post
                    </Typography>
                  </Box>

                  <Divider />

                  {error && <Alert severity="error">{error}</Alert>}

                  <TextField
                    fullWidth
                    required
                    label="Story title"
                    placeholder="Give your story a memorable title"
                    value={title}
                    onChange={(event) =>
                      setTitle(event.target.value.slice(0, TITLE_LIMIT))
                    }
                    helperText={`${title.length}/${TITLE_LIMIT}`}
                  />

                  <Box>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      sx={{
                        mb: 1.25,
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", sm: "center" },
                      }}
                    >
                      <Typography sx={{ fontWeight: 600, fontSize: "1.05rem" }}>
                        Your story
                      </Typography>

                      <Typography
                        color="text.secondary"
                        sx={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: 12,
                        }}
                      >
                        {countWords(body)} words
                      </Typography>
                    </Stack>

                    <TextField
                      fullWidth
                      required
                      placeholder="Begin your story here..."
                      multiline
                      minRows={18}
                      value={body}
                      onChange={(event) =>
                        setBody(event.target.value.slice(0, BODY_LIMIT))
                      }
                      slotProps={{
                        htmlInput: { "aria-label": "Your story" },
                      }}
                      sx={{
                        "& .MuiInputBase-root": {
                          alignItems: "flex-start",
                          fontFamily: '"Newsreader", Georgia, serif',
                          fontSize: "1.15rem",
                          lineHeight: 1.8,
                        },
                      }}
                    />
                  </Box>

                  <Stack
                    direction="row"
                    sx={{ pt: 1, justifyContent: "flex-end" }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SendOutlinedIcon />}
                      disabled={isSubmitting || !canPublish}
                      sx={{ minWidth: 160, py: 1.25 }}
                    >
                      {isSubmitting ? "Publishing..." : "Publish story"}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Paper>

            <Stack
              spacing={2}
              sx={{
                position: { lg: "sticky" },
                top: { lg: 94 },
              }}
            >
              <Paper
                component="aside"
                variant="outlined"
                sx={{
                  p: 2.75,
                  borderColor: "divider",
                  backgroundColor: "background.paper",
                }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <TipsAndUpdatesOutlinedIcon fontSize="small" />
                    <Typography sx={{ fontWeight: 600, fontSize: "1.05rem" }}>
                      Writing guide
                    </Typography>
                  </Stack>

                  <Divider />

                  <GuideItem
                    number="01"
                    title="Create a clear title"
                    description="Use a title that gives readers a reason to open your story."
                  />
                  <GuideItem
                    number="02"
                    title="Make the first lines count"
                    description="The opening should introduce a question, image, or conflict."
                  />
                  <GuideItem
                    number="03"
                    title="Write for one reader"
                    description="Stories that speak to someone specific tend to resonate widely."
                  />
                </Stack>
              </Paper>

              <Paper
                component="aside"
                variant="outlined"
                sx={{
                  p: 2.75,
                  borderColor: "primary.main",
                  backgroundColor: "rgba(31, 138, 112, 0.05)",
                }}
              >
                <Stack direction="row" spacing={1.5}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      flexShrink: 0,
                      display: "grid",
                      placeItems: "center",
                      border: 1.5,
                      borderColor: "primary.main",
                      borderRadius: "50%",
                      color: "primary.main",
                    }}
                  >
                    <BoltOutlinedIcon />
                  </Box>

                  <Box>
                    <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                      Earn energy
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ lineHeight: 1.55 }}
                    >
                      The first support from each new reader adds energy to your
                      account.
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

interface GuideItemProps {
  number: string;
  title: string;
  description: string;
}

function GuideItem({ number, title, description }: GuideItemProps) {
  return (
    <Stack direction="row" spacing={1.5}>
      <Typography
        sx={{
          flexShrink: 0,
          color: "primary.main",
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 12,
          pt: 0.25,
        }}
      >
        {number}
      </Typography>

      <Box>
        <Typography sx={{ fontWeight: 600, mb: 0.4 }}>{title}</Typography>
        <Typography
          color="text.secondary"
          sx={{ fontSize: 14, lineHeight: 1.55 }}
        >
          {description}
        </Typography>
      </Box>
    </Stack>
  );
}
