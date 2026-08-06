import { useEffect, useRef, type ChangeEvent } from "react";
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "../store/useProfileStore";

export function Profile() {
  const { profile, status, error, fetchProfile, clearError } =
    useProfileStore();

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  if (status === "loading" || status === "idle") {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === "error" || !profile) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
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
      <Container maxWidth="lg">
        <Stack spacing={5}>
          {error && (
            <Alert severity="error" onClose={clearError}>
              {error}
            </Alert>
          )}

          <ProfileHeader />
          <StoryGrid />
        </Stack>
      </Container>
    </Box>
  );
}

function ProfileHeader() {
  const { profile, isUploading, uploadAvatar } = useProfileStore();
  const fileInput = useRef<HTMLInputElement>(null);

  if (!profile) return null;

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void uploadAvatar(file);
    event.target.value = ""; // lets you pick the same file twice
  }

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={3}
      alignItems={{ xs: "flex-start", sm: "center" }}
    >
      <Box sx={{ position: "relative" }}>
        <Avatar
          src={profile.avatarUrl ?? undefined}
          sx={{
            width: 104,
            height: 104,
            fontSize: 40,
            color: "primary.main",
            backgroundColor: "rgba(31, 138, 112, 0.10)",
          }}
        >
          {profile.username.charAt(0).toUpperCase()}
        </Avatar>

        {isUploading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              backgroundColor: "rgba(0, 0, 0, 0.45)",
            }}
          >
            <CircularProgress size={28} sx={{ color: "#fff" }} />
          </Box>
        )}

        <IconButton
          onClick={() => fileInput.current?.click()}
          disabled={isUploading}
          aria-label="Change avatar"
          sx={{
            position: "absolute",
            right: -4,
            bottom: -4,
            border: 1,
            borderColor: "divider",
            backgroundColor: "background.paper",
            "&:hover": { backgroundColor: "background.paper" },
          }}
        >
          <PhotoCameraOutlinedIcon fontSize="small" />
        </IconButton>

        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFile}
        />
      </Box>

      <Box>
        <Typography
          variant="h1"
          component="h1"
          sx={{ fontSize: { xs: "2.5rem", md: "3.25rem" } }}
        >
          {profile.username}
        </Typography>

        <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
          <Stat value={profile.postCount} label="stories" />
          <Stat value={profile.totalEnergy} label="energy" accent />
        </Stack>

        <Typography color="text.secondary" sx={{ mt: 1, fontSize: 14 }}>
          Writing since {new Date(profile.createdUtc).toLocaleDateString()}
        </Typography>
      </Box>
    </Stack>
  );
}

function Stat({
  value,
  label,
  accent,
}: {
  value: number;
  label: string;
  accent?: boolean;
}) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="baseline">
      <Typography
        sx={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: "1.35rem",
          color: accent ? "primary.main" : "text.primary",
        }}
      >
        {value}
      </Typography>
      <Typography color="text.secondary" sx={{ fontSize: 14 }}>
        {label}
      </Typography>
    </Stack>
  );
}

function StoryGrid() {
  const profile = useProfileStore((state) => state.profile);
  const navigate = useNavigate();

  if (!profile) return null;

  if (profile.posts.length === 0) {
    return (
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
          No stories yet. Write your first one and start earning energy.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h2" sx={{ fontSize: "2rem", mb: 2.5 }}>
        Your stories
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >
        {profile.posts.map((post) => (
          <Card
            key={post.id}
            variant="outlined"
            sx={{
              borderColor: "divider",
              transition: "transform 180ms ease, box-shadow 180ms ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 16px 34px rgba(19, 26, 34, 0.08)",
              },
            }}
          >
            <CardActionArea
              onClick={() => navigate(`/forum`)}
              sx={{ height: "100%" }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Typography
                  variant="h2"
                  component="h3"
                  sx={{
                    fontSize: "1.35rem",
                    lineHeight: 1.25,
                    mb: 2,
                    minHeight: 66,
                  }}
                >
                  {post.title}
                </Typography>

                <Stack direction="row" spacing={0.75} alignItems="center">
                  <BoltOutlinedIcon
                    fontSize="small"
                    sx={{ color: "primary.main" }}
                  />
                  <Typography
                    sx={{
                      fontFamily: '"JetBrains Mono", monospace',
                      color: "primary.main",
                      fontSize: "1.1rem",
                    }}
                  >
                    {post.energyCount}
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                    energy
                  </Typography>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
