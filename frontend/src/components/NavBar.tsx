import { useEffect } from "react";
import { AppBar, Box, Button, Stack, Toolbar, Typography } from "@mui/material";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useEnergyStore } from "../store/useEnergyStore";

const links = [
  { label: "Main", to: "/" },
  { label: "Forum", to: "/forum" },
  { label: "Daily", to: "/daily" },
  { label: "Store", to: "/store" },
];

export function NavBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Selector form: this component re-renders when `energy` changes, but not
  // when unrelated fields on the energy store (stars, error) change.
  const energy = useEnergyStore((state) => state.energy);
  const fetchDaily = useEnergyStore((state) => state.fetchDaily);

  useEffect(() => {
    if (user) void fetchDaily();
  }, [user, fetchDaily]);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        {links.map((link) => (
          <Button
            key={link.to}
            component={RouterLink}
            to={link.to}
            disableRipple
            sx={{
              borderRadius: 0,
              borderBottom: 2,
              color: pathname === link.to ? "text.primary" : "text.secondary",
              borderColor:
                pathname === link.to ? "primary.main" : "transparent",
              "&:hover": { bgcolor: "transparent", color: "text.primary" },
            }}
          >
            {link.label}
          </Button>
        ))}

        <Box sx={{ flexGrow: 1 }} />

        {user ? (
          <>
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ mr: 2 }}
              aria-label={`${energy} energy`}
            >
              <BoltOutlinedIcon
                fontSize="small"
                sx={{ color: "primary.main" }}
              />
              <Typography
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "1.05rem",
                  color: "primary.main",
                }}
              >
                {energy.toLocaleString()}
              </Typography>
            </Stack>

            <Button
              component={RouterLink}
              to="/profile"
              sx={{ mr: 1, color: "text.secondary" }}
            >
              {user.username}
            </Button>

            <Button
              variant="outlined"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button component={RouterLink} to="/login" variant="contained">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
