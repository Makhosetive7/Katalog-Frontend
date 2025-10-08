"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Chip,
  InputBase,
  alpha,
  Avatar,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  AutoStories as ReadingIcon,
  CheckCircle as CompletedIcon,
  Bookmark as PlannedIcon,
  Pause as PausedIcon,
  ExpandMore as ExpandMoreIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Home as HomeIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

interface UserProfile {
  firstName: string;
  lastName: string;
  readingPreferences: any[];
}

interface User {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  profile: UserProfile;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const useAuthState = (): AuthState => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const reduxState = useSelector((state: any) => state);

  if (!isClient) {
    return {
      user: null,
      isAuthenticated: false,
      isLoading: true,
    };
  }

  try {
    const localUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (localUser && token) {
      const user = JSON.parse(localUser);
      if (user && user.id) {
        return {
          user,
          isAuthenticated: true,
          isLoading: false,
        };
      }
    }
  } catch (error) {
    console.error("Error reading localStorage:", error);
  }

  if (reduxState?.auth?.user) {
    return {
      user: reduxState.auth.user,
      isAuthenticated: true,
      isLoading: false,
    };
  }

  if (reduxState?.user && reduxState.user.id) {
    return {
      user: reduxState.user,
      isAuthenticated: true,
      isLoading: false,
    };
  }

  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
  };
};

const authenticatedNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
  {
    label: "Reading",
    href: "/books/inProgress",
    icon: <ReadingIcon />,
    chip: true,
  },
  { label: "Completed", href: "/books/completed", icon: <CompletedIcon /> },
  { label: "Notes", href: "/books/notes" },
];

const unauthenticatedNavItems = [
  { label: "OnBoarding", href: "/", icon: <HomeIcon /> },
  { label: "About", href: "/about", icon: <InfoIcon /> },
];

const profileMenuItems = [
  { label: "Profile", icon: <ProfileIcon />, href: "/profile" },
  { label: "Settings", icon: <SettingsIcon />, href: "/settings" },
  { label: "Logout", icon: <LogoutIcon />, href: "/logout", color: "error" },
];

export default function NavbarGlass() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pathname = usePathname();

  const { user, isAuthenticated, isLoading } = useAuthState();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setProfileAnchor(event.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchor(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
    handleProfileMenuClose();
  };

  const navItems = isAuthenticated
    ? authenticatedNavItems
    : unauthenticatedNavItems;

  const getUserDisplayName = () => {
    if (!user) return "";
    if (user.profile?.firstName) {
      return `${user.profile.firstName} ${user.profile.lastName || ""}`.trim();
    }
    return user.username || "User";
  };

  const getUserInitials = () => {
    if (!user) return "U";
    if (user.profile?.firstName) {
      return user.profile.firstName[0].toUpperCase();
    }
    return user.username?.[0]?.toUpperCase() || "U";
  };

  const getUsername = () => {
    if (!user) return "";
    return user.username || user.email?.split("@")[0] || "user";
  };

  const drawer = (
    <Box sx={{ width: 260, bgcolor: "#f5f9ff", height: "100%" }}>
      {isAuthenticated && user && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              {getUserInitials()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {getUserDisplayName()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{getUsername()}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <List>
        {navItems.map(({ label, href, icon, chip }) => {
          const isActive = pathname === href;
          return (
            <ListItem key={label} disablePadding>
              <ListItemButton
                component={Link}
                href={href}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  bgcolor: isActive
                    ? alpha(theme.palette.primary.main, 0.15)
                    : "transparent",
                  borderLeft: isActive
                    ? `4px solid ${theme.palette.primary.main}`
                    : "4px solid transparent",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                {icon}
                <ListItemText
                  primary={label}
                  sx={{
                    ml: 1,
                    fontWeight: isActive ? "bold" : "normal",
                    color: isActive ? theme.palette.primary.main : "inherit",
                  }}
                />
                {chip && isAuthenticated && (
                  <Chip label="3" size="small" color="primary" />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  if (isLoading) {
    return (
      <AppBar
        position="sticky"
        sx={{
          backdropFilter: "blur(12px)",
          background: alpha("#ffffff", 0.7),
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        }}
        elevation={0}
      >
        <Toolbar>
          <Box
            component={Link}
            href="/"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            📚
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Katalog
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backdropFilter: "blur(12px)",
          background: alpha("#ffffff", 0.7),
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        }}
        elevation={0}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Box
            component={Link}
            href={isAuthenticated ? "/dashboard" : "/"}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            📚
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Katalog
            </Typography>
          </Box>

          {!isMobile && isAuthenticated && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: alpha(theme.palette.primary.light, 0.15),
                px: 2.5,
                py: 1,
                borderRadius: 4,
                minWidth: 320,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                "&:focus-within": {
                  bgcolor: alpha(theme.palette.primary.light, 0.25),
                  boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                },
              }}
            >
              <SearchIcon sx={{ color: "primary.main", mr: 1 }} />
              <InputBase
                placeholder="Search books..."
                sx={{ flex: 1, fontSize: "0.95rem" }}
              />
            </Box>
          )}

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {navItems.map(({ label, href }) => {
                const isActive = pathname === href;
                return (
                  <Button
                    key={label}
                    href={href}
                    component={Link}
                    sx={{
                      textTransform: "none",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive
                        ? theme.palette.primary.main
                        : "text.primary",
                      borderBottom: isActive
                        ? `2px solid ${theme.palette.primary.main}`
                        : "2px solid transparent",
                      borderRadius: 0,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: theme.palette.primary.main,
                        borderBottom: `2px solid ${theme.palette.primary.main}`,
                      },
                    }}
                  >
                    {label}
                  </Button>
                );
              })}

              {isAuthenticated && (
                <>
                  <Button
                    onClick={handleProfileMenuOpen}
                    endIcon={<ExpandMoreIcon />}
                    startIcon={
                      <Avatar
                        sx={{ width: 24, height: 24, bgcolor: "primary.main" }}
                      >
                        {getUserInitials()}
                      </Avatar>
                    }
                    sx={{ textTransform: "none", fontWeight: 600 }}
                  >
                    {getUserDisplayName()}
                  </Button>
                  <Menu
                    anchorEl={profileAnchor}
                    open={Boolean(profileAnchor)}
                    onClose={handleProfileMenuClose}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem sx={{ pointerEvents: "none", opacity: 0.7 }}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {getUserDisplayName()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          @{getUsername()}
                        </Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem divider />
                    {profileMenuItems.map(({ label, href, icon, color }) => {
                      if (label === "Logout") {
                        return (
                          <MenuItem
                            key={label}
                            onClick={handleLogout}
                            sx={{
                              color:
                                color === "error" ? "error.main" : "inherit",
                              py: 1.5,
                            }}
                          >
                            <Box
                              sx={{
                                mr: 2,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {icon}
                            </Box>
                            {label}
                          </MenuItem>
                        );
                      }
                      return (
                        <MenuItem
                          key={label}
                          component={Link}
                          href={href}
                          onClick={handleProfileMenuClose}
                          sx={{
                            py: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              mr: 2,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {icon}
                          </Box>
                          {label}
                        </MenuItem>
                      );
                    })}
                  </Menu>
                </>
              )}
            </Box>
          )}

          {isMobile && (
            <IconButton onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </>
  );
}
