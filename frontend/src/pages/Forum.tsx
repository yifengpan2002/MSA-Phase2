import {
  Avatar,
  Box,
  Button,
  Chip,
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

interface ForumPost {
  id: number;
  title: string;
  author: string;
  publishedAt: string;
  excerpt: string;
  tags: string[];
  support: number;
}

const forumPosts: ForumPost[] = [
  {
    id: 1,
    title: "The City Beneath the Moon",
    author: "LunaWriter",
    publishedAt: "2 hours ago",
    excerpt:
      "The city only appeared when the second moon rose above the northern mountains. Lanterns flickered like fallen stars, and no one who entered ever spoke of what they found...",
    tags: ["Fantasy", "Adventure"],
    support: 12,
  },
  {
    id: 2,
    title: "Fragments of Tomorrow",
    author: "StarGazer",
    publishedAt: "Yesterday",
    excerpt:
      "They said the fragments were harmless—just pieces of a broken satellite. But every night, the fragments rearranged themselves into patterns no human language could translate...",
    tags: ["Sci-fi", "Mystery"],
    support: 8,
  },
  {
    id: 3,
    title: "Letters to a Distant Earth",
    author: "OrphicEcho",
    publishedAt: "2 days ago",
    excerpt:
      "I found an old radio buried in the sand. It still worked. Every midnight, I send a letter into the static, hoping someone, somewhere, might be listening...",
    tags: ["Drama", "Reflection"],
    support: 15,
  },
];

const trendingTags = [
  "#fantasy",
  "#mystery",
  "#space",
  "#adventure",
  "#romance",
  "#scifi",
  "#drama",
];

export function Forum() {
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
              gridTemplateColumns: {
                xs: "1fr",
                lg: "minmax(0, 1fr) 310px",
              },
              gap: { xs: 3, lg: 3.5 },
              alignItems: "start",
            }}
          >
            <Stack spacing={3}>
              <ForumControls />

              <Stack spacing={1.5}>
                {forumPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </Stack>
            </Stack>

            <ForumSidebar />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

function ForumHeading() {
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
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlinedIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      <Select
        fullWidth
        defaultValue="newest"
        inputProps={{ "aria-label": "Sort stories" }}
      >
        <MenuItem value="newest">Newest</MenuItem>
        <MenuItem value="supported">Most supported</MenuItem>
        <MenuItem value="oldest">Oldest</MenuItem>
      </Select>
    </Box>
  );
}

function PostCard({ post }: { post: ForumPost }) {
  return (
    <Paper
      component="article"
      variant="outlined"
      sx={{
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
          gridTemplateColumns: {
            xs: "1fr",
            sm: "minmax(0, 1fr) 96px",
          },
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

            <Box
              sx={{
                width: "100%",
                minHeight: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mx: "auto",
              }}
            >
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
                {post.author.charAt(0)}
              </Avatar>

              <Typography
                component="span"
                color="text.secondary"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: 14,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                By {post.author}
              </Typography>

              <Typography
                component="span"
                aria-hidden="true"
                color="text.secondary"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: 14,
                  lineHeight: 1,
                }}
              >
                ·
              </Typography>

              <Typography
                component="span"
                color="text.secondary"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: 14,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {post.publishedAt}
              </Typography>
            </Box>
          </Box>

          <Typography sx={{ lineHeight: 1.7 }}>{post.excerpt}</Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {post.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{ backgroundColor: "rgba(31, 138, 112, 0.07)" }}
              />
            ))}
          </Stack>
        </Stack>

        <Stack
          sx={{
            height: "100%",
            minHeight: { xs: 110, sm: 180 },
          }}
          alignItems="flex-end"
        >
          <IconButton
            aria-label={`More options for ${post.title}`}
            size="small"
            sx={{ alignSelf: "flex-end" }}
          >
            <MoreVertIcon />
          </IconButton>

          <Stack
            alignItems="center"
            spacing={0.75}
            sx={{
              mt: "auto",
              ml: "auto",
              alignSelf: "flex-end",
            }}
          >
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
              {post.support}
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
  return (
    <Stack spacing={2}>
      <CommunityCard />
      <DailyPromptCard />
      <TrendingTagsCard />
    </Stack>
  );
}

function CommunityCard() {
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
      <Typography sx={{ fontWeight: 600, fontSize: "1.05rem", mb: 2.25 }}>
        Community
      </Typography>

      <Stack spacing={2}>
        <CommunityStat
          icon={<AutoStoriesOutlinedIcon />}
          value="126"
          label="Stories"
        />
        <CommunityStat
          icon={<PersonOutlineOutlinedIcon />}
          value="48"
          label="Writers"
        />
        <CommunityStat
          icon={<BoltOutlinedIcon />}
          value="890"
          label="Energy earned"
        />
      </Stack>
    </Paper>
  );
}

function CommunityStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
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

function TrendingTagsCard() {
  return (
    <Paper
      component="aside"
      variant="outlined"
      sx={{
        p: 2.75,
        minWidth: 0,
        overflow: "hidden",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: "1.05rem",
          mb: 2,
        }}
      >
        Trending tags
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          width: "100%",
          minWidth: 0,
        }}
      >
        {trendingTags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            sx={{
              maxWidth: "100%",
              backgroundColor: "rgba(31, 138, 112, 0.07)",
              "& .MuiChip-label": {
                px: 1.25,
              },
            }}
          />
        ))}
      </Box>

      <Divider sx={{ my: 2.25 }} />

      <Button
        variant="text"
        endIcon={<ArrowForwardOutlinedIcon />}
        sx={{
          px: 0,
          minWidth: 0,
          justifyContent: "flex-start",
          letterSpacing: 0,
          textTransform: "none",
          fontFamily: '"Karla", system-ui, sans-serif',
          fontSize: 15,
        }}
      >
        Explore all tags
      </Button>
    </Paper>
  );
}
