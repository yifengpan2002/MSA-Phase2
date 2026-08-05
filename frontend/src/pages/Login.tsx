import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuthStore } from "../store/useAuthStore";

export function Login() {
  const [showRegister, setShowRegister] = useState(false);
  const token = useAuthStore((state) => state.token);

  if (token) return <Navigate to="/forum" replace />;

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        backgroundColor: "background.default",
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: 380,
          px: { xs: 3, sm: 4 },
          py: 4,
          backgroundColor: "background.paper",
          borderColor: "divider",
        }}
      >
        <AuthForm
          mode={showRegister ? "register" : "login"}
          onSwitch={() => setShowRegister((current) => !current)}
        />
      </Paper>
    </Box>
  );
}

function AuthForm({
  mode,
  onSwitch,
}: {
  mode: "login" | "register";
  onSwitch: () => void;
}) {
  const navigate = useNavigate();
  const { login, register, isSubmitting, error, clearError } = useAuthStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localError, setLocalError] = useState("");

  const isRegister = mode === "register";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLocalError("");

    if (username.trim().length < 3) {
      setLocalError("Username must be at least 3 characters.");
      return;
    }
    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }
    if (isRegister && password !== confirm) {
      setLocalError("Passwords do not match.");
      return;
    }

    const ok = isRegister
      ? await register(username.trim(), password)
      : await login(username.trim(), password);

    if (ok) navigate("/forum", { replace: true });
  }

  function handleSwitch() {
    clearError();
    setLocalError("");
    onSwitch();
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={2.25}>
      <Typography
        variant="h2"
        component="h1"
        align="center"
        sx={{ fontSize: "2rem" }}
      >
        {isRegister ? "Register" : "Login"}
      </Typography>

      <TextField
        fullWidth
        label="Username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        autoComplete="username"
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete={isRegister ? "new-password" : "current-password"}
      />

      {isRegister && (
        <TextField
          fullWidth
          label="Confirm password"
          type="password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          autoComplete="new-password"
        />
      )}

      {(localError || error) && (
        <Alert severity="error">{localError || error}</Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        color={isRegister ? "secondary" : "primary"}
        disabled={isSubmitting}
        sx={{ alignSelf: "center", minWidth: 140, mt: 1 }}
      >
        {isSubmitting ? "Working…" : isRegister ? "Register" : "Login"}
      </Button>

      <Link
        component="button"
        type="button"
        onClick={handleSwitch}
        underline="always"
        color="text.primary"
        sx={{
          alignSelf: "center",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {isRegister
          ? "Already have an account? Login"
          : "Register if you do not have an account"}
      </Link>
    </Stack>
  );
}
