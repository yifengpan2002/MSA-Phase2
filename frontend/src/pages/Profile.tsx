import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import {
  Alert,
  Avatar,
  Box,
  Button,
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
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/api";
import { useProfileStore } from "../store/useProfileStore";
import type { GalaxyPlanet, Profile as ProfileData } from "../types";

type PageStatus = "idle" | "loading" | "success" | "error";

const PREVIEW_MODEL_SIZE = 2.35;
const DEFAULT_PREVIEW_ROTATION: [number, number, number] = [0.18, -0.55, 0.08];
const MODEL_PREVIEW_ROTATIONS: Record<string, [number, number, number]> = {};
const MODEL_PREVIEW_SIZES: Record<string, number> = {
  "/models/purple.glb": 2.75,
};
const MODEL_PREVIEW_OFFSETS: Record<string, [number, number, number]> = {
  "/models/uranium.glb": [0, -1.078, 0],
};

function getPreviewRotation(modelUrl: string): [number, number, number] {
  return MODEL_PREVIEW_ROTATIONS[modelUrl] ?? DEFAULT_PREVIEW_ROTATION;
}

function getPreviewSize(modelUrl: string) {
  return MODEL_PREVIEW_SIZES[modelUrl] ?? PREVIEW_MODEL_SIZE;
}

function getPreviewOffset(modelUrl: string): [number, number, number] {
  return MODEL_PREVIEW_OFFSETS[modelUrl] ?? [0, 0, 0];
}

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

        <Button
          component={RouterLink}
          to={
            isOwner
              ? "/galaxy"
              : `/users/${encodeURIComponent(profile.username)}/galaxy`
          }
          startIcon={<AutoAwesomeOutlinedIcon />}
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Galaxy
        </Button>
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
            <Card
              key={planet.id}
              variant="outlined"
              sx={{
                overflow: "hidden",
                backgroundColor: "background.paper",
              }}
            >
              <Box
                sx={{
                  height: 132,
                  borderBottom: 1,
                  borderColor: "divider",
                  background: `radial-gradient(circle at 50% 42%, ${planet.colorHex}33, transparent 44%), linear-gradient(135deg, rgba(5,7,8,0.95), rgba(14,24,28,0.86))`,
                }}
              >
                <ProfilePlanetPreview planet={planet} />
              </Box>

              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6">{planet.name}</Typography>
                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{ alignItems: "center", mt: 0.5 }}
                >
                  <AutoAwesomeOutlinedIcon
                    fontSize="small"
                    sx={{ color: "primary.main" }}
                  />
                  <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                    owned planet
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}

function isModelPath(modelUrl: string | null): modelUrl is string {
  return (
    typeof modelUrl === "string" &&
    modelUrl.startsWith("/models/") &&
    modelUrl.toLowerCase().endsWith(".glb")
  );
}

function ProfilePlanetPreview({ planet }: { planet: GalaxyPlanet }) {
  const modelUrl = isModelPath(planet.modelUrl) ? planet.modelUrl : null;

  return (
    <Canvas
      camera={{ position: [0, 0.15, 4.25], fov: 34 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ height: "100%", width: "100%" }}
    >
      <ambientLight intensity={1.25} />
      <hemisphereLight args={["#f2fff9", "#11191d", 1.15]} />
      <directionalLight intensity={2.8} position={[3.5, 3, 4]} />
      <pointLight color={planet.colorHex} intensity={1.25} position={[-3, 1, 3]} />

      <Suspense fallback={<PreviewFallbackPlanet color={planet.colorHex} />}>
        {modelUrl ? (
          <PreviewModelBoundary
            fallback={<PreviewFallbackPlanet color={planet.colorHex} />}
          >
            <PreviewModel modelUrl={modelUrl} />
          </PreviewModelBoundary>
        ) : (
          <PreviewFallbackPlanet color={planet.colorHex} />
        )}
      </Suspense>

      <Environment preset="night" />
    </Canvas>
  );
}

function PreviewModel({ modelUrl }: { modelUrl: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelUrl);
  const rotation = getPreviewRotation(modelUrl);
  const offset = getPreviewOffset(modelUrl);

  const { clone, scale } = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();

    box.getCenter(center);
    box.getSize(size);
    clone.position.sub(center);

    const maxAxis = Math.max(size.x, size.y, size.z) || 1;

    return {
      clone,
      scale: getPreviewSize(modelUrl) / maxAxis,
    };
  }, [modelUrl, scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.55;
  });

  return (
    <group ref={groupRef} position={offset} rotation={rotation}>
      <primitive object={clone} scale={scale} />
    </group>
  );
}

function PreviewFallbackPlanet({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.55;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 48, 48]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.08}
        roughness={0.72}
      />
    </mesh>
  );
}

class PreviewModelBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
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
