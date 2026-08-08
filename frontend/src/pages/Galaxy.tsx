import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Html,
  OrbitControls,
  PerspectiveCamera,
  Stars,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { Link as RouterLink, useParams } from "react-router-dom";
import { api } from "../api/api";
import { getGalaxyLayout } from "../helper/galaxyLayout";
import type {
  GalaxyLeaderboardEntry,
  GalaxyLeaderboardResponse,
  GalaxyPlanet,
} from "../types";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

type GalaxyStatus = "loading" | "ready" | "error";

const MODEL_DISPLAY_SIZE = 1.6;
const OVERVIEW_CAMERA = new THREE.Vector3(0, 4.6, 16);
const OVERVIEW_TARGET = new THREE.Vector3(0, 0, 0);
const DETAIL_CAMERA_OFFSET = new THREE.Vector3(0.45, 0.24, 1)
  .normalize()
  .multiplyScalar(4.1);
const MODEL_DISPLAY_SIZES: Record<string, number> = {
  "/models/purple.glb": 1.85,
};

function isModelPath(modelUrl: string | null): modelUrl is string {
  return (
    typeof modelUrl === "string" &&
    modelUrl.startsWith("/models/") &&
    modelUrl.toLowerCase().endsWith(".glb")
  );
}

export function Galaxy() {
  const { username } = useParams<{ username?: string }>();
  const isPublicGalaxy = Boolean(username);
  const encodedUsername = username ? encodeURIComponent(username) : "";
  const profilePath = isPublicGalaxy ? `/users/${encodedUsername}` : "/profile";

  const [planets, setPlanets] = useState<GalaxyPlanet[]>([]);
  const [leaderboard, setLeaderboard] =
    useState<GalaxyLeaderboardResponse | null>(null);
  const [status, setStatus] = useState<GalaxyStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const galaxyGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    let active = true;

    async function loadGalaxy() {
      setStatus("loading");
      setError(null);

      try {
        const [result, leaderboardResult] = await Promise.all([
          isPublicGalaxy && username
            ? api.getUserGalaxy(username)
            : api.getMyGalaxy(),
          isPublicGalaxy
            ? Promise.resolve(null)
            : api.getGalaxyLeaderboard().catch(() => null),
        ]);

        if (!active) return;

        setPlanets(result);
        setLeaderboard(leaderboardResult);
        setSelectedId(null);
        setStatus("ready");
      } catch (loadError) {
        if (!active) return;

        setLeaderboard(null);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load this galaxy.",
        );
        setStatus("error");
      }
    }

    void loadGalaxy();

    return () => {
      active = false;
    };
  }, [isPublicGalaxy, username]);

  const selectedPlanet = useMemo(
    () => planets.find((planet) => planet.id === selectedId) ?? null,
    [planets, selectedId],
  );

  if (status === "loading") {
    return (
      <Box sx={{ display: "grid", minHeight: "70vh", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === "error") {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error ?? "Could not load this galaxy."}
        </Alert>
        <Button component={RouterLink} to={profilePath} variant="contained">
          Back to profile
        </Button>
      </Container>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        height: "100vh",
        inset: 0,
        minHeight: 0,
        overflow: "hidden",
        position: "fixed",
        width: "100vw",
        zIndex: (theme) => theme.zIndex.appBar + 1,
        background:
          "radial-gradient(circle at 28% 18%, #203634 0, #11191d 34%, #050708 100%)",
      }}
    >
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false }}
        onPointerMissed={() => setSelectedId(null)}
        style={{ display: "block", height: "100%", width: "100%" }}
      >
        <color attach="background" args={["#050708"]} />
        <fog attach="fog" args={["#050708", 20, 48]} />
        <PerspectiveCamera makeDefault position={OVERVIEW_CAMERA} fov={42} />
        <ambientLight intensity={1.15} />
        <hemisphereLight args={["#d7fff4", "#17211f", 1.35]} />
        <directionalLight
          castShadow
          intensity={3.4}
          position={[8, 9, 8]}
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight color="#7bd3c2" intensity={2.2} position={[-8, 2, -6]} />
        <CameraFocus
          controlsRef={controlsRef}
          galaxyGroupRef={galaxyGroupRef}
          planets={planets}
          selectedId={selectedId}
        />
        <OverviewRotation
          galaxyGroupRef={galaxyGroupRef}
          selectedId={selectedId}
        />
        <Stars
          radius={55}
          depth={32}
          count={1400}
          factor={4}
          saturation={0.2}
          fade
        />
        <Environment preset="night" />

        {planets.length > 0 && (
          <PlanetCluster
            groupRef={galaxyGroupRef}
            planets={planets}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}

        <OrbitControls
          ref={controlsRef}
          autoRotate={false}
          enableDamping
          enablePan={false}
          enableRotate={Boolean(selectedId)}
          maxDistance={30}
          minDistance={1.35}
        />
      </Canvas>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(90deg, rgba(5,7,8,0.72), rgba(5,7,8,0.08) 42%, rgba(5,7,8,0.62))",
        }}
      />

      <Stack
        spacing={2}
        sx={{
          position: "absolute",
          top: { xs: 24, md: 34 },
          left: { xs: 18, md: 42 },
          maxWidth: { xs: "calc(100% - 36px)", sm: 430 },
          pointerEvents: "auto",
        }}
      >
        <Button
          component={RouterLink}
          to={profilePath}
          startIcon={<ArrowBackOutlinedIcon />}
          sx={{
            alignSelf: "flex-start",
            color: "rgba(255,255,255,0.72)",
            borderColor: "rgba(255,255,255,0.28)",
          }}
          variant="outlined"
        >
          Profile
        </Button>

        <Box>
          <Typography
            component="h1"
            variant="h1"
            sx={{
              color: "common.white",
              fontSize: { xs: "2.6rem", md: "4rem" },
              lineHeight: 1,
              textShadow: "0 12px 36px rgba(0,0,0,0.45)",
            }}
          >
            {isPublicGalaxy ? `${username}'s galaxy` : "My galaxy"}
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.72)",
              fontSize: { xs: 14, md: 16 },
              mt: 1.5,
              maxWidth: 360,
            }}
          >
            {isPublicGalaxy
              ? "Every planet here is part of this writer's collected galaxy."
              : "Every planet here is one you bought with energy from writing, supporting, and returning daily."}
          </Typography>
        </Box>
      </Stack>

      {!isPublicGalaxy && <LeaderboardPanel leaderboard={leaderboard} />}

      {planets.length === 0 ? (
        <EmptyGalaxy isPublicGalaxy={isPublicGalaxy} profilePath={profilePath} />
      ) : (
        <PlanetPanel
          count={planets.length}
          planet={selectedPlanet}
          onClear={() => setSelectedId(null)}
        />
      )}
    </Box>
  );
}

function CameraFocus({
  controlsRef,
  galaxyGroupRef,
  planets,
  selectedId,
}: {
  controlsRef: RefObject<OrbitControlsImpl | null>;
  galaxyGroupRef: RefObject<THREE.Group | null>;
  planets: GalaxyPlanet[];
  selectedId: string | null;
}) {
  const { camera } = useThree();
  const transitionRef = useRef({
    active: true,
    cameraPosition: OVERVIEW_CAMERA.clone(),
    focus: OVERVIEW_TARGET.clone(),
  });

  useEffect(() => {
    const selectedIndex = selectedId
      ? planets.findIndex((planet) => planet.id === selectedId)
      : -1;
    const focus =
      selectedIndex >= 0
        ? getPlanetWorldPosition(selectedIndex, planets.length, galaxyGroupRef)
        : OVERVIEW_TARGET;
    const cameraPosition =
      selectedIndex >= 0
        ? focus.clone().add(DETAIL_CAMERA_OFFSET)
        : OVERVIEW_CAMERA;

    transitionRef.current = {
      active: true,
      cameraPosition,
      focus,
    };
  }, [galaxyGroupRef, planets, selectedId]);

  useFrame((_, delta) => {
    const transition = transitionRef.current;
    if (!transition.active) return;

    const easing = 1 - Math.pow(0.006, delta);

    camera.position.lerp(transition.cameraPosition, easing);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(transition.focus, easing);
      controlsRef.current.update();
    } else {
      camera.lookAt(transition.focus);
    }

    const cameraReady =
      camera.position.distanceTo(transition.cameraPosition) < 0.015;
    const targetReady =
      !controlsRef.current ||
      controlsRef.current.target.distanceTo(transition.focus) < 0.015;

    if (cameraReady && targetReady) {
      camera.position.copy(transition.cameraPosition);

      if (controlsRef.current) {
        controlsRef.current.target.copy(transition.focus);
        controlsRef.current.update();
      } else {
        camera.lookAt(transition.focus);
      }

      transition.active = false;
    }
  });

  return null;
}

function getPlanetWorldPosition(
  index: number,
  total: number,
  galaxyGroupRef: RefObject<THREE.Group | null>,
) {
  const position = new THREE.Vector3(...getGalaxyLayout(index, total).position);
  return galaxyGroupRef.current
    ? galaxyGroupRef.current.localToWorld(position)
    : position;
}

function OverviewRotation({
  galaxyGroupRef,
  selectedId,
}: {
  galaxyGroupRef: RefObject<THREE.Group | null>;
  selectedId: string | null;
}) {
  const { gl } = useThree();
  const dragRef = useRef({
    active: false,
    lastX: 0,
    lastY: 0,
  });

  useEffect(() => {
    const canvas = gl.domElement;

    function handlePointerDown(event: PointerEvent) {
      if (selectedId || event.button !== 0) return;

      dragRef.current = {
        active: true,
        lastX: event.clientX,
        lastY: event.clientY,
      };
      canvas.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event: PointerEvent) {
      const drag = dragRef.current;
      if (!drag.active || !galaxyGroupRef.current) return;

      const deltaX = event.clientX - drag.lastX;
      const deltaY = event.clientY - drag.lastY;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;

      galaxyGroupRef.current.rotation.y += deltaX * 0.006;
      galaxyGroupRef.current.rotation.x = THREE.MathUtils.clamp(
        galaxyGroupRef.current.rotation.x + deltaY * 0.004,
        -0.75,
        0.75,
      );
    }

    function handlePointerUp(event: PointerEvent) {
      dragRef.current.active = false;
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    }

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [galaxyGroupRef, gl, selectedId]);

  useFrame((_, delta) => {
    if (selectedId || dragRef.current.active || !galaxyGroupRef.current) return;
    galaxyGroupRef.current.rotation.y += delta * 0.04;
  });

  return null;
}

function PlanetCluster({
  groupRef,
  planets,
  selectedId,
  onSelect,
}: {
  groupRef: RefObject<THREE.Group | null>;
  planets: GalaxyPlanet[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <group ref={groupRef}>
      {planets.map((planet, index) => {
        const layout = getGalaxyLayout(index, planets.length);
        return (
          <PlanetNode
            key={planet.id}
            layout={layout}
            planet={planet}
            selected={planet.id === selectedId}
            onSelect={onSelect}
          />
        );
      })}
    </group>
  );
}

function PlanetNode({
  planet,
  layout,
  selected,
  onSelect,
}: {
  planet: GalaxyPlanet;
  layout: ReturnType<typeof getGalaxyLayout>;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const modelUrl = isModelPath(planet.modelUrl) ? planet.modelUrl : null;
  const baseScale =
    layout.displayScale * Math.max(0.08, Math.min(4, planet.modelScale || 1));
  const targetScale = selected
    ? baseScale * 1.08
    : hovered
      ? baseScale * 1.04
      : baseScale;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += layout.rotationSpeed * delta * 60;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      1 - Math.pow(0.001, delta),
    );
  });

  return (
    <group
      ref={groupRef}
      position={layout.position}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(planet.id);
      }}
      onPointerOut={() => setHovered(false)}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
    >
      <Suspense fallback={<PlanetLoading color={planet.colorHex} />}>
        {modelUrl ? (
          <PlanetModelBoundary fallback={<FallbackPlanet color={planet.colorHex} />}>
            <ModelPlanet modelUrl={modelUrl} />
          </PlanetModelBoundary>
        ) : (
          <FallbackPlanet color={planet.colorHex} />
        )}
      </Suspense>

      {selected && (
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={1.55}>
          <torusGeometry args={[1.15, 0.015, 16, 96]} />
          <meshBasicMaterial color="#8de7d0" transparent opacity={0.72} />
        </mesh>
      )}

      {hovered && (
        <Html center distanceFactor={9} position={[0, 1.7, 0]}>
          <Box
            sx={{
              color: "common.white",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              textShadow: "0 2px 10px rgba(0,0,0,0.85)",
            }}
          >
            {planet.name}
          </Box>
        </Html>
      )}
    </group>
  );
}

function ModelPlanet({ modelUrl }: { modelUrl: string }) {
  const { scene } = useGLTF(modelUrl);
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
      scale: (MODEL_DISPLAY_SIZES[modelUrl] ?? MODEL_DISPLAY_SIZE) / maxAxis,
    };
  }, [modelUrl, scene]);

  return (
    <group>
      <primitive object={clone} scale={scale} />
    </group>
  );
}

class PlanetModelBoundary extends Component<
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

function PlanetLoading({ color }: { color: string }) {
  return (
    <mesh>
      <sphereGeometry args={[0.95, 32, 32]} />
      <meshStandardMaterial
        color={color}
        roughness={0.8}
        transparent
        opacity={0.35}
      />
    </mesh>
  );
}

function FallbackPlanet({ color }: { color: string }) {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.08}
          metalness={0.08}
          roughness={0.72}
        />
      </mesh>
      <Atmosphere color={color} />
    </group>
  );
}

function Atmosphere({ color }: { color: string }) {
  return (
    <mesh scale={1.08}>
      <sphereGeometry args={[1, 48, 48]} />
      <meshBasicMaterial
        color={color}
        side={THREE.BackSide}
        transparent
        opacity={0.16}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function LeaderboardPanel({
  leaderboard,
}: {
  leaderboard: GalaxyLeaderboardResponse | null;
}) {
  if (!leaderboard || leaderboard.totalUsers === 0) return null;

  const currentUser = leaderboard.currentUser;
  const currentUserIsTopRanked = Boolean(
    currentUser &&
      leaderboard.topUsers.some((entry) => entry.userId === currentUser.userId),
  );

  return (
    <Box
      component="aside"
      sx={{
        position: "absolute",
        top: { xs: 218, md: 34 },
        right: { xs: 18, md: 42 },
        width: { xs: "calc(100% - 36px)", sm: 340 },
        maxWidth: 360,
        pointerEvents: "auto",
        color: "common.white",
        border: "1px solid rgba(255,255,255,0.18)",
        backgroundColor: "rgba(5,7,8,0.66)",
        backdropFilter: "blur(16px)",
        p: 2,
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <AutoAwesomeOutlinedIcon sx={{ color: "#8de7d0" }} />
          <Box>
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 12,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Galaxy leaderboard
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.58)", fontSize: 12 }}>
              Ranked by planet energy spent
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={1}>
          {leaderboard.topUsers.map((entry) => (
            <LeaderboardRow
              key={entry.userId}
              entry={entry}
              highlight={currentUser?.userId === entry.userId}
            />
          ))}

          {currentUser && !currentUserIsTopRanked && (
            <>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.14)" }} />
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.55)",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  textAlign: "center",
                }}
              >
                ...
              </Typography>
              <LeaderboardRow entry={currentUser} highlight />
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}

function LeaderboardRow({
  entry,
  highlight,
}: {
  entry: GalaxyLeaderboardEntry;
  highlight?: boolean;
}) {
  return (
    <Box
      component={RouterLink}
      to={`/users/${encodeURIComponent(entry.username)}`}
      sx={{
        display: "grid",
        gridTemplateColumns: "34px 34px minmax(0, 1fr) auto",
        gap: 1,
        alignItems: "center",
        border: "1px solid",
        borderColor: highlight
          ? "rgba(141,231,208,0.54)"
          : "rgba(255,255,255,0.12)",
        backgroundColor: highlight
          ? "rgba(141,231,208,0.12)"
          : "rgba(255,255,255,0.045)",
        color: "common.white",
        p: 1,
        textDecoration: "none",
        transition: "border-color 150ms ease, background-color 150ms ease",
        "&:hover": {
          borderColor: "rgba(141,231,208,0.72)",
          backgroundColor: "rgba(141,231,208,0.16)",
        },
      }}
    >
      <Typography
        sx={{
          color: highlight ? "#8de7d0" : "rgba(255,255,255,0.62)",
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 12,
        }}
      >
        #{entry.rank}
      </Typography>

      <Avatar
        src={entry.avatarUrl ?? undefined}
        sx={{
          width: 34,
          height: 34,
          bgcolor: "rgba(141,231,208,0.12)",
          color: "#8de7d0",
          fontSize: 14,
        }}
      >
        {entry.username.charAt(0).toUpperCase()}
      </Avatar>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          noWrap
          sx={{
            color: "common.white",
            fontSize: 14,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {entry.username}
          {highlight ? " · you" : ""}
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.58)", fontSize: 12 }}>
          {entry.planetCount} {entry.planetCount === 1 ? "planet" : "planets"}
        </Typography>
      </Box>

      <Stack spacing={0.15} sx={{ alignItems: "flex-end" }}>
        <Typography
          sx={{
            color: "#8de7d0",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 14,
            lineHeight: 1,
          }}
        >
          {entry.totalEnergySpent.toLocaleString()}
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>
          energy
        </Typography>
      </Stack>
    </Box>
  );
}

function EmptyGalaxy({
  isPublicGalaxy,
  profilePath,
}: {
  isPublicGalaxy: boolean;
  profilePath: string;
}) {
  return (
    <Stack
      spacing={2}
      sx={{
        alignItems: { xs: "stretch", sm: "flex-start" },
        bottom: { xs: 24, md: 38 },
        left: { xs: 18, md: 42 },
        maxWidth: { xs: "calc(100% - 36px)", sm: 360 },
        position: "absolute",
        pointerEvents: "auto",
      }}
    >
      <Alert
        icon={<AutoAwesomeOutlinedIcon />}
        severity="info"
        sx={{
          backgroundColor: "rgba(255,255,255,0.9)",
          color: "text.primary",
        }}
      >
        {isPublicGalaxy
          ? "This writer does not own any planets yet."
          : "You do not own any planets yet."}
      </Alert>
      <Button
        component={RouterLink}
        startIcon={
          isPublicGalaxy ? <ArrowBackOutlinedIcon /> : <StorefrontOutlinedIcon />
        }
        to={isPublicGalaxy ? profilePath : "/store"}
        variant="contained"
      >
        {isPublicGalaxy ? "Back to profile" : "Visit store"}
      </Button>
    </Stack>
  );
}

function PlanetPanel({
  count,
  planet,
  onClear,
}: {
  count: number;
  planet: GalaxyPlanet | null;
  onClear: () => void;
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        right: { xs: 18, md: 42 },
        bottom: { xs: 24, md: 38 },
        width: { xs: "calc(100% - 36px)", sm: 340 },
        pointerEvents: "auto",
        color: "common.white",
        border: "1px solid rgba(255,255,255,0.18)",
        backgroundColor: "rgba(5,7,8,0.66)",
        backdropFilter: "blur(16px)",
        p: 2.5,
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <AutoAwesomeOutlinedIcon sx={{ color: "#8de7d0" }} />
          <Typography
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {count} {count === 1 ? "planet" : "planets"} owned
          </Typography>
        </Stack>

        {planet ? (
          <>
            <Box>
              <Typography
                variant="h2"
                sx={{ color: "common.white", fontSize: "2rem" }}
              >
                {planet.name}
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.68)", mt: 0.75 }}>
                Acquired {new Date(planet.acquiredUtc).toLocaleDateString()}
              </Typography>
            </Box>

            <Box
              sx={{
                borderLeft: 3,
                borderColor: planet.colorHex,
                pl: 1.5,
              }}
            >
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.76)",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 12,
                  overflowWrap: "anywhere",
                }}
              >
                {planet.modelUrl ?? "Fallback colored sphere"}
              </Typography>
            </Box>

            <Button
              onClick={onClear}
              variant="outlined"
              sx={{ color: "common.white" }}
            >
              Back to full galaxy
            </Button>
          </>
        ) : (
          <Typography sx={{ color: "rgba(255,255,255,0.72)" }}>
            Click a planet to inspect it.
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

[
  "/models/alien.glb",
  "/models/lava.glb",
  "/models/garden.glb",
  "/models/stylized.glb",
  "/models/purple-gas.glb",
  "/models/cottage-small.glb",
  "/models/purple.glb",
  "/models/uranium.glb",
  "/models/dusk.glb",
  "/models/solar-crown.glb",
  "/models/devourer.glb",
].forEach((modelUrl) => {
  useGLTF.preload(modelUrl);
});
