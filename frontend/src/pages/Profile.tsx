import { useEffect, useRef, useState, type ChangeEvent } from "react";
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
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/api";
import { useProfileStore } from "../store/useProfileStore";
import type { GalaxyPlanet, Profile as ProfileData } from "../types";

type PageStatus = "idle" | "loading" | "success" | "error";

export function Profile() {
  const { username } = useParams<{ username?: string }>();
  const isPublicProfile = Boolean(username);

  const {
    profile: myProfile,
    status: myStatus,
    error: myError,
    fetchProfile,
    clearError,
  } = useProfileStore();

  const [publicProfile, setPublicProfile] = useState<ProfileData | null>(null);
  const [publicStatus, setPublicStatus] = useState<PageStatus>("idle");
  const [publicError, setPublicError] = useState("");
  const [planets, setPlanets] = useState<GalaxyPlanet[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      if (isPublicProfile) {
        if (!username) return;

        try {
          setPublicStatus("loading");
          setPublicError("");

          const [profileData, galaxyData] = await Promise.all([
            api.getUserProfile(username),
            api.getUserGalaxy(username),
          ]);

          if (!isMounted) return;

          setPublicProfile(profileData);
          setPlanets(galaxyData);
          setPublicStatus("success");
        } catch (error) {
          if (!isMounted) return;

          setPublicError(
            error instanceof Error
              ? error.message
              : "Could not load this profile.",
          );
          setPublicStatus("error");
        }

        return;
      }

      void fetchProfile();

      try {
        const galaxyData = await api.getMyGalaxy();
        if (isMounted) setPlanets(galaxyData);
      } catch {
        if (isMounted) setPlanets([]);
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [fetchProfile, isPublicProfile, username]);

  const profile = isPublicProfile ? publicProfile : myProfile;
  const status = isPublicProfile ? publicStatus : myStatus;
  const error = isPublicProfile ? publicError : myError;
  const isOwner = !isPublicProfile;

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
        <Alert severity="error">{error || "Profile not found."}</Alert>
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
          {error && isOwner && (
            <Alert severity="error" onClose={clearError}>
              {error}
            </Alert>
          )}

          <ProfileHeader profile={profile} isOwner={isOwner} />
          <PlanetGrid
            planets={planets}
            isOwner={isOwner}
            username={profile.username}
          />
          <StoryGrid profile={profile} isOwner={isOwner} />
        </Stack>
      </Container>
    </Box>
  );
}

function ProfileHeader({
  profile,
  isOwner,
}: {
  profile: ProfileData;
  isOwner: boolean;
}) {
  const { isUploading, uploadAvatar } = useProfileStore();
  const fileInput = useRef<HTMLInputElement>(null);

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file && isOwner) void uploadAvatar(file);
    event.target.value = "";
  }

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={3}
      sx={{
        p: { xs: 3, md: 4 },
        alignItems: { xs: "flex-start", sm: "center" },
        border: 1,
        borderColor: "divider",
        borderRadius: 6,
        backgroundColor: "background.paper",
      }}
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

        {isOwner && isUploading && (
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

        {isOwner && (
          <>
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
          </>
        )}
      </Box>

      <Box>
        <Typography
          variant="h1"
          component="h1"
          sx={{ fontSize: { xs: "2.5rem", md: "3.25rem" } }}
        >
          {profile.username}
        </Typography>

        <Stack direction="row" spacing={3} sx={{ mt: 1, flexWrap: "wrap" }}>
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

function PlanetGrid({
  planets,
  isOwner,
  username,
}: {
  planets: GalaxyPlanet[];
  isOwner: boolean;
  username: string;
}) {
  return (
    <Box>
      <Typography variant="h2" sx={{ fontSize: "2rem", mb: 2.5 }}>
        {isOwner ? "Your galaxy" : `${username}'s galaxy`}
      </Typography>

      {planets.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: "center",
            borderStyle: "dashed",
            borderColor: "divider",
          }}
        >
          <Typography color="text.secondary">No planets yet.</Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {planets.map((planet) => (
            <Card key={planet.id} variant="outlined">
              <CardContent>
                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ alignItems: "center" }}
                >
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: "50%",
                      backgroundColor: planet.colorHex,
                      boxShadow: `0 0 24px ${planet.colorHex}`,
                    }}
                  />

                  <Box>
                    <Typography variant="h6">{planet.name}</Typography>
                    <Stack
                      direction="row"
                      spacing={0.75}
                      sx={{ alignItems: "center" }}
                    >
                      <AutoAwesomeOutlinedIcon
                        fontSize="small"
                        sx={{ color: "primary.main" }}
                      />
                      <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                        owned planet
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
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
    <Stack direction="row" spacing={0.75} sx={{ alignItems: "baseline" }}>
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

function StoryGrid({
  profile,
  isOwner,
}: {
  profile: ProfileData;
  isOwner: boolean;
}) {
  const navigate = useNavigate();

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
          {isOwner
            ? "No stories yet. Write your first one and start earning energy."
            : "This writer has not posted any stories yet."}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h2" sx={{ fontSize: "2rem", mb: 2.5 }}>
        {isOwner ? "Your stories" : `${profile.username}'s stories`}
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
              onClick={() => navigate(`/forum/${post.id}`)}
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

                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{ alignItems: "center" }}
                >
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
