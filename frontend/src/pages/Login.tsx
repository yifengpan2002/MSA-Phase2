import { useState } from "react";
import {
  Box,
  Button,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export function Login() {
  const [showRegister, setShowRegister] = useState(false);

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
        {showRegister ? (
          <RegisterForm onShowLogin={() => setShowRegister(false)} />
        ) : (
          <LoginForm onShowRegister={() => setShowRegister(true)} />
        )}
      </Paper>
    </Box>
  );
}

interface LoginFormProps {
  onShowRegister: () => void;
}

function LoginForm({ onShowRegister }: LoginFormProps) {
  return (
    <Stack component="form" spacing={2.25}>
      <Typography
        variant="h2"
        component="h1"
        align="center"
        sx={{ fontSize: "2rem" }}
      >
        Login
      </Typography>

      <TextField
        fullWidth
        label="Username"
        name="username"
        autoComplete="username"
      />

      <TextField
        fullWidth
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
      />

      <Button
        type="button"
        variant="contained"
        sx={{
          alignSelf: "center",
          minWidth: 120,
          mt: 1,
        }}
      >
        Login
      </Button>

      <Link
        component="button"
        type="button"
        onClick={onShowRegister}
        underline="always"
        color="text.primary"
        sx={{
          alignSelf: "center",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Register if you do not have an account
      </Link>
    </Stack>
  );
}

interface RegisterFormProps {
  onShowLogin: () => void;
}

function RegisterForm({ onShowLogin }: RegisterFormProps) {
  return (
    <Stack component="form" spacing={2.25}>
      <Typography
        variant="h2"
        component="h1"
        align="center"
        sx={{ fontSize: "2rem" }}
      >
        Register
      </Typography>

      <TextField
        fullWidth
        label="Username"
        name="registerUsername"
        autoComplete="username"
      />

      <TextField
        fullWidth
        label="Email"
        name="registerEmail"
        type="email"
        autoComplete="email"
      />

      <TextField
        fullWidth
        label="Password"
        name="registerPassword"
        type="password"
        autoComplete="new-password"
      />

      <TextField
        fullWidth
        label="Confirm password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
      />

      <Button
        type="button"
        variant="contained"
        color="secondary"
        sx={{
          alignSelf: "center",
          minWidth: 140,
          mt: 1,
          color: "text.primary",
        }}
      >
        Register
      </Button>

      <Link
        component="button"
        type="button"
        onClick={onShowLogin}
        underline="always"
        color="text.primary"
        sx={{
          alignSelf: "center",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Already have an account? Login
      </Link>
    </Stack>
  );
}
