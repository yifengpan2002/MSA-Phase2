import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const links = [
  { label: "Main", to: "/" },
  { label: "Forum", to: "/forum" },
];

export function NavBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

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
