import { useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import { useEnergyStore } from "../store/useEnergyStore";

const PREVIEW_DAYS = [1, 2, 3, 4, 5, 6, 7];
const REWARDS: Record<number, number> = {
  1: 10,
  2: 20,
  3: 40,
  4: 80,
  5: 160,
  6: 200,
  7: 200,
};

export function Daily() {
  const {
    daily,
    energy,
    status,
    error,
    isClaiming,
    lastClaimAmount,
    fetchDaily,
    claimDaily,
    dismissClaim,
    clearError,
  } = useEnergyStore();

  useEffect(() => {
    void fetchDaily();
  }, [fetchDaily]);

  if (status === "loading" || !daily) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ minHeight: "100vh", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="md">
        <Stack spacing={4}>
          <Box>
            <Typography
              variant="h1"
              component="h1"
              sx={{ fontSize: { xs: "3rem", md: "4rem" } }}
            >
              Daily energy
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Come back each day. The reward doubles until day six.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" onClose={clearError}>
              {error}
            </Alert>
          )}

          {lastClaimAmount !== null && (
            <Alert
              severity="success"
              icon={<BoltOutlinedIcon />}
              onClose={dismissClaim}
            >
              You earned {lastClaimAmount} energy. Day {daily.currentStreak} of
              your streak.
            </Alert>
          )}

          <Paper
            variant="outlined"
            sx={{ p: { xs: 3, md: 5 }, textAlign: "center" }}
          >
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "text.secondary",
              }}
            >
              Your balance
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{ mt: 1.5, justifyContent: "center", alignItems: "center" }}
            >
              <BoltOutlinedIcon sx={{ color: "primary.main", fontSize: 40 }} />
              <Typography
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "3.5rem",
                  lineHeight: 1,
                  color: "primary.main",
                }}
              >
                {energy.toLocaleString()}
              </Typography>
            </Stack>

            <Button
              variant="contained"
              size="large"
              disabled={!daily.canClaimToday || isClaiming}
              onClick={() => void claimDaily()}
              sx={{ mt: 4, minWidth: 240, py: 1.5 }}
            >
              {isClaiming
                ? "Claiming..."
                : daily.canClaimToday
                  ? `Claim ${daily.nextReward} energy`
                  : "Come back tomorrow"}
            </Button>

            <Typography color="text.secondary" sx={{ mt: 2, fontSize: 14 }}>
              Current streak: {daily.currentStreak} - Best:{" "}
              {daily.longestStreak}
            </Typography>
          </Paper>

          <Box>
            <Typography variant="h2" sx={{ fontSize: "1.5rem", mb: 2 }}>
              Streak rewards
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(4, 1fr)",
                  sm: "repeat(7, 1fr)",
                },
                gap: 1.5,
              }}
            >
              {PREVIEW_DAYS.map((day) => {
                const claimed = day <= daily.currentStreak;
                return (
                  <Paper
                    key={day}
                    variant="outlined"
                    sx={{
                      py: 2,
                      textAlign: "center",
                      borderColor: claimed ? "primary.main" : "divider",
                      backgroundColor: claimed
                        ? "rgba(31, 138, 112, 0.06)"
                        : "transparent",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 11,
                        color: "text.secondary",
                      }}
                    >
                      DAY {day}
                    </Typography>

                    {claimed ? (
                      <CheckCircleOutlineIcon
                        sx={{ color: "primary.main", mt: 0.5 }}
                      />
                    ) : (
                      <Typography
                        sx={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: "1.1rem",
                          mt: 0.5,
                        }}
                      >
                        {REWARDS[day]}
                      </Typography>
                    )}
                  </Paper>
                );
              })}
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
