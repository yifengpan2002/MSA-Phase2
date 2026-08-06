import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import { api } from "../api/api";

const suggestedTags = [
  "Fantasy",
  "Adventure",
  "Mystery",
  "Sci-fi",
  "Drama",
  "Romance",
];

export function WritePost() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const body = String(formData.get("content") ?? "").trim();

    try {
      await api.createPost({ title, body });
      navigate("/forum");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to publish story.",
      );
    } finally {
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
              href="/forum"
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
              gridTemplateColumns: {
                xs: "1fr",
                lg: "minmax(0, 1fr) 310px",
              },
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
              <Stack component="form" spacing={3} onSubmit={handleSubmit}>
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

                <TextField
                  fullWidth
                  required
                  label="Story title"
                  name="title"
                  placeholder="Give your story a memorable title"
                />

                <TextField
                  fullWidth
                  label="Short description"
                  name="description"
                  placeholder="Write a short introduction for the forum preview"
                  multiline
                  minRows={3}
                  helperText="This summary will appear on the forum page."
                />

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <FormControl fullWidth>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      label="Category"
                      defaultValue=""
                    >
                      <MenuItem value="">Select a category</MenuItem>
                      <MenuItem value="fantasy">Fantasy</MenuItem>
                      <MenuItem value="science-fiction">
                        Science fiction
                      </MenuItem>
                      <MenuItem value="mystery">Mystery</MenuItem>
                      <MenuItem value="drama">Drama</MenuItem>
                      <MenuItem value="romance">Romance</MenuItem>
                      <MenuItem value="reflection">Reflection</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Custom tags"
                    name="tags"
                    placeholder="space, mystery, adventure"
                    helperText="Separate tags with commas."
                  />
                </Box>

                <Box>
                  <Typography
                    color="text.secondary"
                    sx={{ fontSize: 13, mb: 1.25 }}
                  >
                    Suggested tags
                  </Typography>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {suggestedTags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        clickable
                        variant="outlined"
                        sx={{
                          "&:hover": {
                            borderColor: "primary.main",
                            backgroundColor: "rgba(31, 138, 112, 0.06)",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={1}
                    sx={{ mb: 1.25 }}
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
                      0 words
                    </Typography>
                  </Stack>

                  <TextField
                    fullWidth
                    required
                    name="content"
                    placeholder="Begin your story here..."
                    multiline
                    minRows={18}
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
                  direction={{ xs: "column-reverse", sm: "row" }}
                  justifyContent="flex-end"
                  spacing={1.5}
                  sx={{ pt: 1 }}
                >
                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<SaveOutlinedIcon />}
                    sx={{ minWidth: 150, py: 1.25 }}
                  >
                    Save draft
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SendOutlinedIcon />}
                    disabled={isSubmitting}
                    sx={{ minWidth: 150, py: 1.25 }}
                  >
                    {isSubmitting ? "Publishing..." : "Publish story"}
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            <Stack spacing={2}>
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
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <TipsAndUpdatesOutlinedIcon fontSize="small" />
                    <Typography sx={{ fontWeight: 600, fontSize: "1.05rem" }}>
                      Writing guide
                    </Typography>
                  </Stack>

                  <Divider />
                  {error && <Alert severity="error">{error}</Alert>}

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
                    title="Choose useful tags"
                    description="Tags help readers discover stories that match their interests."
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
                      The first support from each new reader can add energy to
                      your account.
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
