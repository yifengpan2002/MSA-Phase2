import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useEnergyStore } from "../store/useEnergyStore";
import { useColorMode } from "./colorMode";

const links = [
  { label: "Main", to: "/" },
  { label: "Forum", to: "/forum" },
  { label: "Daily", to: "/daily" },
  { label: "Store", to: "/store" },
  { label: "Galaxy", to: "/galaxy" },
];

export function NavBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { mode, toggleMode } = useColorMode();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const energy = useEnergyStore((state) => state.energy);
  const fetchDaily = useEnergyStore((state) => state.fetchDaily);

  useEffect(() => {
    if (user) void fetchDaily();
  }, [user, fetchDaily]);

  const isActive = (to: string) =>
    pathname === to || (to !== "/" && pathname.startsWith(`${to}/`));

  function handleLogout() {
    setMenuAnchor(null);
    logout();
    navigate("/");
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{ color: "text.primary" }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 62, md: 70 },
          px: { xs: 1.5, sm: 2.5, lg: 4 },
          gap: { xs: 0.75, md: 1.25 },
        }}
      >
        <IconButton
          aria-label="Open navigation"
          onClick={(event) => setMenuAnchor(event.currentTarget)}
          sx={{ display: { xs: "inline-flex", md: "none" } }}
        >
          <MenuOutlinedIcon />
        </IconButton>

        <Typography
          component={RouterLink}
          to="/"
          sx={{
            mr: { xs: 0.5, md: 1.5 },
            color: "text.primary",
            textDecoration: "none",
            fontFamily: '"Newsreader", Georgia, serif',
            fontSize: { xs: "1.8rem", md: "2.1rem" },
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          Orbit
        </Typography>

        <Box
          component="nav"
          aria-label="Main navigation"
          sx={{ display: { xs: "none", md: "flex" }, gap: 0.5 }}
        >
          {links.map((link) => (
            <Button
              key={link.to}
              component={RouterLink}
              to={link.to}
              disableRipple
              sx={{
                px: 1.6,
                color: isActive(link.to) ? "text.primary" : "text.secondary",
                border: 1,
                borderColor: isActive(link.to) ? "divider" : "transparent",
                backgroundColor: isActive(link.to)
                  ? "rgba(127, 225, 200, 0.08)"
                  : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(127, 225, 200, 0.10)",
                  color: "text.primary",
                },
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {user && (
          <Stack
            direction="row"
            spacing={0.5}
            aria-label={`${energy} energy`}
            sx={{
              mr: { xs: 0.25, sm: 1 },
              px: { xs: 1, sm: 1.3 },
              py: 0.65,
              alignItems: "center",
              border: 1,
              borderColor: "divider",
              borderRadius: 999,
              backgroundColor: "rgba(127, 225, 200, 0.08)",
            }}
          >
            <BoltOutlinedIcon fontSize="small" sx={{ color: "primary.main" }} />
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: { xs: "0.9rem", sm: "1rem" },
                color: "primary.main",
              }}
            >
              {energy.toLocaleString()}
            </Typography>
          </Stack>
        )}

        <Tooltip title={mode === "dark" ? "Switch to light" : "Switch to dark"}>
          <IconButton
            aria-label={
              mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            onClick={toggleMode}
            sx={{ border: 1, borderColor: "divider" }}
          >
            {mode === "dark" ? (
              <LightModeOutlinedIcon fontSize="small" />
            ) : (
              <DarkModeOutlinedIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>

        {user ? (
          <>
            <Button
              component={RouterLink}
              to="/profile"
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                color: isActive("/profile") ? "primary.main" : "text.secondary",
              }}
            >
              {user.username}
            </Button>

            <Button
              variant="outlined"
              onClick={handleLogout}
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button component={RouterLink} to="/login" variant="contained">
            Login
          </Button>
        )}

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                minWidth: 220,
                border: 1,
                borderColor: "divider",
              },
            },
          }}
        >
          {links.map((link) => (
            <MenuItem
              key={link.to}
              component={RouterLink}
              to={link.to}
              selected={isActive(link.to)}
              onClick={() => setMenuAnchor(null)}
            >
              {link.label}
            </MenuItem>
          ))}

          {user && [
            <Divider key="divider" />,
            <MenuItem
              key="profile"
              component={RouterLink}
              to="/profile"
              selected={isActive("/profile")}
              onClick={() => setMenuAnchor(null)}
            >
              Profile
            </MenuItem>,
            <MenuItem key="logout" onClick={handleLogout}>
              Logout
            </MenuItem>,
          ]}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
