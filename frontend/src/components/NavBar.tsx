import { AppBar, Box, Button, Toolbar } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

const links = [
  { label: "Main", to: "/" },
  { label: "Forum", to: "/forum" },
];

export function NavBar() {
  const { pathname } = useLocation();
  console.log("hello");
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
        {links.map((link) => {
          const isActive = pathname === link.to;
          return (
            <Button
              key={link.to}
              component={RouterLink}
              to={link.to}
              disableRipple
              sx={{
                borderRadius: 0,
                borderBottom: 2,
                color: isActive ? "text.primary" : "text.secondary",
                borderColor: isActive ? "primary.main" : "transparent",
                "&:hover": { bgcolor: "transparent", color: "text.primary" },
              }}
            >
              {link.label}
            </Button>
          );
        })}

        <Box sx={{ flexGrow: 1 }} />

        <Button component={RouterLink} to="/login" variant="contained">
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
}
