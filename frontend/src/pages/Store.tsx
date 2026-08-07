import { useEffect } from "react";
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
import { useEnergyStore } from "../store/useEnergyStore";
import type { StarType } from "../types";

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

            <Stack
              direction="row"
              spacing={0.75}
              sx={{ alignItems: "center" }}
            >
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
          py: 4,
          display: "grid",
          placeItems: "center",
          background: `radial-gradient(circle at 50% 20%, ${star.colorHex}28, transparent 36%), linear-gradient(135deg, ${star.colorHex}12, transparent)`,
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            width: 104,
            height: 104,
            borderRadius: "50%",
            background: `radial-gradient(circle at 30% 24%, rgba(255, 255, 255, 0.78), ${star.colorHex} 34%, rgba(6, 8, 12, 0.88) 100%)`,
            boxShadow: `0 0 42px ${star.colorHex}55, inset -18px -22px 30px rgba(0, 0, 0, 0.38)`,
            position: "relative",
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
      </Box>

      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "flex-start" }}
        >
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
