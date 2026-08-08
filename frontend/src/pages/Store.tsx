import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useEnergyStore } from "../store/useEnergyStore";
import type { StarType } from "../types";

const PREVIEW_MODEL_SIZE = 2.35;
const DEFAULT_PREVIEW_ROTATION: [number, number, number] = [0.18, -0.55, 0.08];
const MODEL_PREVIEW_ROTATIONS: Record<string, [number, number, number]> = {};
const MODEL_PREVIEW_SIZES: Record<string, number> = {
  "/models/purple.glb": 2.75,
};
const MODEL_PREVIEW_OFFSETS: Record<string, [number, number, number]> = {
  "/models/uranium.glb": [0, -1.078, 0],
};

function isModelPath(modelUrl: string | null): modelUrl is string {
  return (
    typeof modelUrl === "string" &&
    modelUrl.startsWith("/models/") &&
    modelUrl.toLowerCase().endsWith(".glb")
  );
}

function isImagePath(imageUrl: string | null | undefined): imageUrl is string {
  return (
    typeof imageUrl === "string" &&
    imageUrl.startsWith("/stars/") &&
    /\.(png|jpe?g|webp)$/i.test(imageUrl)
  );
}

function getPreviewRotation(modelUrl: string): [number, number, number] {
  return MODEL_PREVIEW_ROTATIONS[modelUrl] ?? DEFAULT_PREVIEW_ROTATION;
}

function getPreviewSize(modelUrl: string) {
  return MODEL_PREVIEW_SIZES[modelUrl] ?? PREVIEW_MODEL_SIZE;
}

function getPreviewOffset(modelUrl: string): [number, number, number] {
  return MODEL_PREVIEW_OFFSETS[modelUrl] ?? [0, 0, 0];
}

export function Store() {
  const { stars, energy, status, error, fetchStars, fetchDaily, clearError } =
    useEnergyStore();

  useEffect(() => {
    void fetchStars();
    void fetchDaily(); // keeps the balance correct on a direct visit
  }, [fetchStars, fetchDaily]);

  if (status === "loading" && stars.length === 0) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ minHeight: "100vh", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "flex-end" },
            }}
          >
            <Box>
              <Typography
                variant="h1"
                component="h1"
                sx={{ fontSize: { xs: "3rem", md: "4rem" } }}
              >
                Star store
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Spend the energy your readers gave you.
              </Typography>
            </Box>

            <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
              <BoltOutlinedIcon sx={{ color: "primary.main" }} />
              <Typography
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "1.75rem",
                  color: "primary.main",
                }}
              >
                {energy.toLocaleString()}
              </Typography>
            </Stack>
          </Stack>

          {error && (
            <Alert severity="error" onClose={clearError}>
              {error}
            </Alert>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 2.5,
            }}
          >
            {stars.map((star) => (
              <StarCard key={star.id} star={star} />
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

function StarCard({ star }: { star: StarType }) {
  const { energy, purchasingId, purchase } = useEnergyStore();
  const affordable = energy >= star.cost;
  const busy = purchasingId === star.id;

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        overflow: "hidden",
        transition: "transform 180ms ease, box-shadow 180ms ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <Box
        sx={{
          py: 3.5,
          display: "grid",
          placeItems: "center",
          background: `radial-gradient(circle at 50% 20%, ${star.colorHex}28, transparent 36%), linear-gradient(135deg, ${star.colorHex}12, transparent)`,
        }}
      >
        <PlanetPreviewAvatar star={star} />
      </Box>

      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="h2"
              component="h3"
              sx={{ fontSize: "1.35rem" }}
            >
              {star.name}
            </Typography>

            {star.ownedCount > 0 && (
              <Typography
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 11,
                  color: "primary.main",
                }}
              >
                OWNED x{star.ownedCount}
              </Typography>
            )}
          </Box>

          <IconButton
            onClick={() => void purchase(star.id)}
            disabled={!affordable || busy}
            aria-label={`Buy ${star.name} for ${star.cost} energy`}
            sx={{
              border: 1,
              borderColor: affordable ? "primary.main" : "divider",
              color: affordable ? "primary.main" : "text.disabled",
            }}
          >
            {busy ? <CircularProgress size={20} /> : <AddIcon />}
          </IconButton>
        </Stack>

        <Typography
          color="text.secondary"
          sx={{ mt: 1, fontSize: 14, lineHeight: 1.6 }}
        >
          {star.description}
        </Typography>

        <Stack
          direction="row"
          spacing={0.5}
          sx={{ mt: 2, alignItems: "center" }}
        >
          <BoltOutlinedIcon
            fontSize="small"
            sx={{ color: affordable ? "primary.main" : "text.disabled" }}
          />
          <Typography
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "1.1rem",
              color: affordable ? "primary.main" : "text.disabled",
            }}
          >
            {star.cost.toLocaleString()}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function PlanetPreviewAvatar({ star }: { star: StarType }) {
  const modelUrl = isModelPath(star.modelUrl) ? star.modelUrl : null;
  const imageUrl = isImagePath(star.imageUrl) ? star.imageUrl : null;
  const fallback = imageUrl ? (
    <PlanetImageAvatar imageUrl={imageUrl} />
  ) : (
    <FallbackPlanetAvatar star={star} />
  );

  return (
    <Box
      role="img"
      aria-label={`${star.name} planet preview`}
      sx={{
        width: { xs: 152, sm: 168 },
        height: 140,
        borderRadius: 3,
        overflow: "visible",
        position: "relative",
        border: 1,
        borderColor: "divider",
        background:
          "radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.16), rgba(5, 8, 12, 0.88) 68%)",
        boxShadow: `0 0 48px ${star.colorHex}66`,
      }}
    >
      {modelUrl ? (
        <PlanetPreviewBoundary fallback={fallback}>
          <Canvas
            camera={{ position: [0, 0.15, 4.25], fov: 34 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={1.75} />
            <directionalLight position={[3, 4, 5]} intensity={3.25} />
            <directionalLight position={[-3, -1, -2]} intensity={1.05} />

            <Suspense fallback={null}>
              <PlanetPreviewModel modelUrl={modelUrl} />
            </Suspense>
          </Canvas>
        </PlanetPreviewBoundary>
      ) : (
        fallback
      )}
    </Box>
  );
}

function PlanetImageAvatar({ imageUrl }: { imageUrl: string }) {
  return (
    <Box
      alt=""
      component="img"
      src={imageUrl}
      sx={{
        display: "block",
        height: "100%",
        objectFit: "contain",
        width: "100%",
      }}
    />
  );
}

function PlanetPreviewModel({ modelUrl }: { modelUrl: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelUrl);
  const rotation = getPreviewRotation(modelUrl);
  const offset = getPreviewOffset(modelUrl);

  const { clone, scale } = useMemo(() => {
    const clonedScene = scene.clone(true);

    clonedScene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxAxis = Math.max(size.x, size.y, size.z, 0.001);

    clonedScene.position.sub(center);

    return {
      clone: clonedScene,
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

class PlanetPreviewBoundary extends Component<
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

function FallbackPlanetAvatar({ star }: { star: StarType }) {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(circle at 30% 24%, rgba(255, 255, 255, 0.78), ${star.colorHex} 34%, rgba(6, 8, 12, 0.88) 100%)`,
        "&::after": {
          content: '""',
          position: "absolute",
          inset: "16% 9%",
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.34), transparent 46%)",
          transform: "rotate(-18deg)",
        },
      }}
    />
  );
}
