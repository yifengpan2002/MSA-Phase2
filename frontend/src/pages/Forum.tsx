import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { usePostStore } from "../store/usePostStore";
import { relativeTime } from "../helper/timeFormat";
import type { Post, SortOrder } from "../types";

const PREVIEW_LENGTH = 200;

function preview(body: string): string {
  const clean = body.trim().replace(/\s+/g, " ");
  return clean.length <= PREVIEW_LENGTH
    ? clean
    : `${clean.slice(0, PREVIEW_LENGTH).trimEnd()}…`;
}

export function Forum() {
  const { posts, status, error, fetchPosts } = usePostStore();

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

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
          <ForumHeading />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 310px" },
              gap: { xs: 3, lg: 3.5 },
              alignItems: "start",
            }}
          >
            <Stack spacing={3}>
              <ForumControls />

              {(status === "loading" || status === "idle") && (
                <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
                  <CircularProgress />
                </Box>
              )}

              {status === "error" && <Alert severity="error">{error}</Alert>}

              {status === "ready" && posts.length === 0 && (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 6,
                    textAlign: "center",
                    borderStyle: "dashed",
                    borderColor: "divider",
                  }}
                >
                  <Typography color="text.secondary">
                    No stories yet. Be the first to write one.
                  </Typography>
                </Paper>
              )}

              {status === "ready" && (
                <Stack spacing={1.5}>
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </Stack>
              )}
            </Stack>

            <ForumSidebar />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

function ForumHeading() {
  const navigate = useNavigate();

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      spacing={2.5}
    >
      <Box>
        <Typography
          variant="h1"
          component="h1"
          sx={{ fontSize: { xs: "3rem", md: "4rem" }, mb: 0.75 }}
        >
          Forum
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ fontSize: { xs: "1rem", md: "1.08rem" } }}
        >
          Discover stories from writers across the universe.
        </Typography>
      </Box>

      <Button
        variant="contained"
        size="large"
        startIcon={<EditOutlinedIcon />}
        onClick={() => navigate("/write")}
        sx={{
          minWidth: 180,
          py: 1.35,
          alignSelf: { xs: "stretch", sm: "center" },
        }}
      >
        Write a story
      </Button>
    </Stack>
  );
}

function ForumControls() {
  const { sort, setSort } = usePostStore();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 1fr) 220px" },
        gap: 1.5,
      }}
    >
      <TextField
        fullWidth
        placeholder="Search stories, writers, tags..."
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon color="action" />
              </InputAdornment>
            ),
          },
        }}
      />

      <Select
        fullWidth
        value={sort}
        onChange={(event) => void setSort(event.target.value as SortOrder)}
        inputProps={{ "aria-label": "Sort stories" }}
      >
        <MenuItem value="newest">Newest</MenuItem>
        <MenuItem value="supported">Most supported</MenuItem>
        <MenuItem value="oldest">Oldest</MenuItem>
      </Select>
    </Box>
  );
}

function PostCard({ post }: { post: Post }) {
  const navigate = useNavigate();

  return (
    <Paper
      component="article"
      variant="outlined"
      onClick={() => navigate(`/forum/${post.id}`)}
      sx={{
        cursor: "pointer",
        p: { xs: 2.5, sm: 3 },
        borderColor: "divider",
        backgroundColor: "background.paper",
        transition: "transform 180ms ease, box-shadow 180ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 16px 34px rgba(19, 26, 34, 0.08)",
        },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 1fr) 96px" },
          gap: { xs: 2, sm: 2.5 },
          alignItems: "stretch",
        }}
      >
        <Stack spacing={1.5}>
          <Box>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: "1.75rem", md: "2rem" },
                lineHeight: 1.15,
                mb: 0.75,
              }}
            >
              {post.title}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar
                sx={{
                  width: 26,
                  height: 26,
                  fontSize: 12,
                  flexShrink: 0,
                  color: "primary.main",
                  backgroundColor: "rgba(31, 138, 112, 0.10)",
                }}
              >
                {post.authorName.charAt(0).toUpperCase()}
              </Avatar>

              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                By {post.authorName} · {relativeTime(post.createdUtc)}
              </Typography>
            </Stack>
          </Box>

          <Typography sx={{ lineHeight: 1.7 }}>{preview(post.body)}</Typography>
        </Stack>

        <Stack
          alignItems="flex-end"
          sx={{ height: "100%", minHeight: { xs: 110, sm: 160 } }}
        >
          <IconButton
            aria-label={`More options for ${post.title}`}
            size="small"
            onClick={(event) => event.stopPropagation()}
          >
            <MoreVertIcon />
          </IconButton>

          <Stack alignItems="center" spacing={0.75} sx={{ mt: "auto" }}>
            <Box
              sx={{
                width: 54,
                height: 54,
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

            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "1.25rem",
                lineHeight: 1,
              }}
            >
              {post.supportCount}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ fontSize: 12, lineHeight: 1 }}
            >
              support
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}

function ForumSidebar() {
  const posts = usePostStore((state) => state.posts);

  const writers = new Set(posts.map((post) => post.authorId)).size;
  const energy = posts.reduce((total, post) => total + post.supportCount, 0);

  return (
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
        <Typography sx={{ fontWeight: 600, fontSize: "1.05rem", mb: 2.25 }}>
          Community
        </Typography>

        <Stack spacing={2}>
          <CommunityStat
            icon={<AutoStoriesOutlinedIcon />}
            value={posts.length}
            label="Stories"
          />
          <CommunityStat
            icon={<PersonOutlineOutlinedIcon />}
            value={writers}
            label="Writers"
          />
          <CommunityStat
            icon={<BoltOutlinedIcon />}
            value={energy}
            label="Energy earned"
          />
        </Stack>
      </Paper>

      <DailyPromptCard />
    </Stack>
  );
}

function CommunityStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Box sx={{ width: 28, display: "grid", placeItems: "center" }}>
        {icon}
      </Box>
      <Typography
        sx={{
          minWidth: 50,
          color: "primary.main",
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: "1.35rem",
        }}
      >
        {value}
      </Typography>
      <Typography color="text.secondary">{label}</Typography>
    </Stack>
  );
}

function DailyPromptCard() {
  return (
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
            Daily prompt
          </Typography>
        </Stack>

        <Divider />

        <Typography sx={{ lineHeight: 1.65 }}>
          Write about a forgotten planet that suddenly begins sending messages.
        </Typography>

        <Button
          variant="text"
          endIcon={<ArrowForwardOutlinedIcon />}
          sx={{
            alignSelf: "flex-start",
            px: 0,
            letterSpacing: 0,
            textTransform: "none",
            fontFamily: '"Karla", system-ui, sans-serif',
            fontSize: 15,
          }}
        >
          See all prompts
        </Button>
      </Stack>
    </Paper>
  );
}
