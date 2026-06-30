"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  alpha,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  AutoStories as ReadingIcon,
  CheckCircle as CompletedIcon,
  ExpandMore as ExpandMoreIcon,
  EditNote as NotesIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Home as HomeIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import KatalogLogo from "./KatalogLogo";
import { useLogoutMutation } from "@/redux/api/books";
import {
  AUTH_CHANGE_EVENT,
  clearAuthSession,
  getStoredAuth,
  type StoredUser,
} from "@/utils/authStorage";

interface AuthState {
  user: StoredUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const FONT = "system-ui, -apple-system, sans-serif";
const WINE = "#5C2E2E";
const CREAM = "#FAF6F0";
const DARK = "#1E1612";
const GREEN = "#58CC02";

const drawerItemSx = (active: boolean) => ({
  borderRadius: 0,
  py: 1.5,
  minHeight: 48,
  borderLeft: `3px solid ${active ? WINE : "transparent"}`,
  bgcolor: active ? alpha(WINE, 0.06) : "transparent",
  "&:hover": { bgcolor: alpha(WINE, 0.04) },
});

const drawerSectionLabelSx = {
  px: 2.5,
  pt: 2,
  pb: 0.75,
  fontFamily: FONT,
  fontSize: "0.68rem",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
  color: alpha(WINE, 0.45),
};

const mobileIconButtonSx = (isDarkNav: boolean) => ({
  color: isDarkNav ? CREAM : WINE,
  border: `1px solid ${isDarkNav ? alpha(CREAM, 0.2) : alpha(WINE, 0.12)}`,
  borderRadius: 0,
  width: 44,
  height: 44,
});

const useAuthState = (pathname: string): AuthState => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const stored = getStoredAuth();
    return { ...stored, isLoading: false };
  });

  useEffect(() => {
    const syncAuth = () => {
      const stored = getStoredAuth();
      setAuthState({ ...stored, isLoading: false });
    };

    syncAuth();
    window.addEventListener(AUTH_CHANGE_EVENT, syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, [pathname]);

  return authState;
};

const authenticatedNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon fontSize="small" /> },
  { label: "Reading", href: "/books/inProgress", icon: <ReadingIcon fontSize="small" /> },
  { label: "Completed", href: "/books/completed", icon: <CompletedIcon fontSize="small" /> },
  { label: "Notes", href: "/books/notes", icon: <NotesIcon fontSize="small" /> },
];

const unauthenticatedNavItems = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Preview", href: "/#progress" },
];

const profileMenuItems = [
  { label: "Profile", icon: <ProfileIcon fontSize="small" />, href: "/profile" },
  { label: "Settings", icon: <SettingsIcon fontSize="small" />, href: "/settings" },
] as const;

export default function NavbarGlass() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pathname = usePathname();
  const router = useRouter();

  const { user, isAuthenticated, isLoading } = useAuthState(pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const isDarkNav = isAuthenticated || pathname === "/";
  const isAuthPage = pathname.startsWith("/auth") || pathname === "/reset-password";
  const navItems = isAuthenticated ? authenticatedNavItems : unauthenticatedNavItems;

  const handleDrawerToggle = () => setMobileOpen((open) => !open);
  const handleProfileMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setProfileAnchor(e.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchor(null);

  const handleNavigate = (href: string) => {
    handleProfileMenuClose();
    setMobileOpen(false);
    router.push(href);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    setMobileOpen(false);
    try {
      await logout().unwrap();
    } catch {
      /* local logout still applies */
    }
    clearAuthSession();
    router.push("/auth/login");
  };

  const getUserDisplayName = () => {
    if (!user) return "";
    if (user.profile?.firstName) {
      return `${user.profile.firstName} ${user.profile.lastName || ""}`.trim();
    }
    return user.username || "User";
  };

  const getUserInitials = () => {
    if (!user) return "U";
    if (user.profile?.firstName) return user.profile.firstName[0].toUpperCase();
    return user.username?.[0]?.toUpperCase() || "U";
  };

  const getUsername = () => user?.username || user?.email?.split("@")[0] || "user";

  const isNavActive = (href: string) => {
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navLinkSx = (active: boolean) => ({
    textTransform: "none" as const,
    fontFamily: FONT,
    fontWeight: active ? 600 : 500,
    fontSize: "0.875rem",
    color: isDarkNav
      ? active
        ? CREAM
        : alpha(CREAM, 0.65)
      : active
        ? WINE
        : alpha(DARK, 0.6),
    px: 1.75,
    py: 0.75,
    minWidth: 0,
    borderRadius: 0,
    "&:hover": {
      color: isDarkNav ? CREAM : WINE,
      bgcolor: isDarkNav ? alpha(CREAM, 0.06) : alpha(WINE, 0.05),
    },
  });

  const desktopNavLinks = (
    <Box
      component="nav"
      aria-label="Main navigation"
      sx={{
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        gap: 0.5,
        ...(isDarkNav
          ? { position: "absolute", left: "50%", transform: "translateX(-50%)" }
          : {}),
      }}
    >
      {navItems.map(({ label, href }) => (
        <Button
          key={label}
          component={Link}
          href={href}
          sx={navLinkSx(isNavActive(href))}
        >
          {label}
        </Button>
      ))}
    </Box>
  );

  const accountAvatar = (
    <Avatar
      sx={{
        width: 28,
        height: 28,
        bgcolor: alpha(CREAM, 0.12),
        color: CREAM,
        fontFamily: FONT,
        fontSize: "0.75rem",
        fontWeight: 700,
        border: `1px solid ${alpha(CREAM, 0.25)}`,
      }}
    >
      {getUserInitials()}
    </Avatar>
  );

  const accountMenu = (
    <Menu
      id="account-menu"
      anchorEl={profileAnchor}
      open={Boolean(profileAnchor)}
      onClose={handleProfileMenuClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            minWidth: 220,
            borderRadius: 0,
            bgcolor: CREAM,
            border: `1px solid ${alpha(WINE, 0.12)}`,
            borderTop: `3px solid ${WINE}`,
            boxShadow: "0 12px 40px rgba(30, 22, 18, 0.14)",
            overflow: "hidden",
          },
        },
        list: { sx: { py: 0.5 } },
      }}
    >
      <Box sx={{ px: 2, py: 1.5, bgcolor: alpha(WINE, 0.03) }}>
        <Typography sx={{ fontFamily: FONT, fontWeight: 600, fontSize: "0.9rem", color: DARK }}>
          {getUserDisplayName()}
        </Typography>
        <Typography sx={{ fontFamily: FONT, fontSize: "0.78rem", color: alpha(DARK, 0.5) }}>
          @{getUsername()}
        </Typography>
      </Box>
      <Divider sx={{ borderColor: alpha(WINE, 0.1) }} />
      {profileMenuItems.map(({ label, href, icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <MenuItem
            key={label}
            onClick={() => handleNavigate(href)}
            selected={active}
            sx={{
              py: 1.25,
              px: 2,
              fontFamily: FONT,
              fontSize: "0.875rem",
              gap: 1.5,
              color: active ? WINE : DARK,
              bgcolor: active ? alpha(WINE, 0.06) : "transparent",
              "&:hover": { bgcolor: alpha(WINE, 0.05) },
              "& .MuiSvgIcon-root": { color: active ? WINE : alpha(DARK, 0.55) },
            }}
          >
            {icon}
            {label}
          </MenuItem>
        );
      })}
      <Divider sx={{ borderColor: alpha(WINE, 0.1) }} />
      <MenuItem
        onClick={handleLogout}
        disabled={isLoggingOut}
        sx={{
          py: 1.25,
          px: 2,
          fontFamily: FONT,
          fontSize: "0.875rem",
          gap: 1.5,
          color: "#B84A4A",
          "&:hover": { bgcolor: alpha("#B84A4A", 0.06) },
          "& .MuiSvgIcon-root": { color: "#B84A4A" },
        }}
      >
        <LogoutIcon fontSize="small" />
        {isLoggingOut ? "Signing out…" : "Sign out"}
      </MenuItem>
    </Menu>
  );

  const authActions = !isAuthenticated ? (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Button
        component={Link}
        href="/auth/login"
        sx={{
          display: { xs: "none", sm: "inline-flex" },
          textTransform: "none",
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: "0.875rem",
          color: isDarkNav ? alpha(CREAM, 0.8) : alpha(DARK, 0.7),
          "&:hover": { color: isDarkNav ? CREAM : WINE, bgcolor: "transparent" },
        }}
      >
        Log in
      </Button>
      <Button
        component={Link}
        href="/auth/register"
        variant="contained"
        endIcon={<ArrowForwardIcon sx={{ fontSize: "16px !important" }} />}
        sx={{
          textTransform: "none",
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: "0.875rem",
          px: 2.25,
          py: 1,
          borderRadius: 0,
          bgcolor: isDarkNav ? CREAM : WINE,
          color: isDarkNav ? DARK : CREAM,
          boxShadow: "none",
          "&:hover": {
            bgcolor: isDarkNav ? "#FFFFFF" : "#3D1C1C",
            boxShadow: "none",
          },
        }}
      >
        Start tracking
      </Button>
    </Box>
  ) : (
    <>
      <Button
        onClick={handleProfileMenuOpen}
        sx={{
          display: { xs: "none", sm: "inline-flex" },
          textTransform: "none",
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: "0.875rem",
          color: alpha(CREAM, 0.8),
          gap: 1,
          "&:hover": { color: CREAM, bgcolor: "transparent" },
        }}
        aria-haspopup="true"
        aria-expanded={Boolean(profileAnchor)}
        aria-controls="account-menu"
        aria-label="Open account menu"
      >
        {accountAvatar}
        <Box component="span" sx={{ display: { xs: "none", lg: "inline" } }}>
          {getUserDisplayName().split(" ")[0]}
        </Box>
        <ExpandMoreIcon sx={{ fontSize: 18, display: { xs: "none", lg: "inline-flex" } }} />
      </Button>
      <Button
        component={Link}
        href="/books/inProgress"
        variant="contained"
        endIcon={<ArrowForwardIcon sx={{ fontSize: "16px !important" }} />}
        sx={{
          textTransform: "none",
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: "0.875rem",
          px: 2.25,
          py: 1,
          borderRadius: 0,
          bgcolor: CREAM,
          color: DARK,
          boxShadow: "none",
          "&:hover": { bgcolor: "#FFFFFF", boxShadow: "none" },
        }}
      >
        Add book
      </Button>
    </>
  );

  const mobileDrawer = (
    <Box
      sx={{
        width: { xs: "100vw", sm: 320 },
        maxWidth: "100vw",
        height: "100%",
        bgcolor: CREAM,
        display: "flex",
        flexDirection: "column",
        borderLeft: `3px solid ${WINE}`,
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          borderBottom: `1px solid ${alpha(WINE, 0.08)}`,
          bgcolor: alpha(WINE, 0.02),
        }}
      >
        <KatalogLogo
          href={isAuthenticated ? "/dashboard" : "/"}
          size="sm"
          onClick={() => setMobileOpen(false)}
        />
        <IconButton
          onClick={handleDrawerToggle}
          size="small"
          aria-label="Close menu"
          sx={mobileIconButtonSx(false)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {isAuthenticated && user && (
        <Box
          sx={{
            px: 2.5,
            py: 2,
            borderBottom: `1px solid ${alpha(WINE, 0.08)}`,
            bgcolor: "#FFFFFF",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: WINE,
                width: 44,
                height: 44,
                borderRadius: 0,
                fontFamily: FONT,
                fontWeight: 700,
              }}
            >
              {getUserInitials()}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                noWrap
                sx={{ fontFamily: FONT, fontWeight: 600, fontSize: "0.95rem", color: DARK }}
              >
                {getUserDisplayName()}
              </Typography>
              <Typography
                noWrap
                sx={{ fontFamily: FONT, fontSize: "0.78rem", color: alpha(DARK, 0.5) }}
              >
                @{getUsername()}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {!isAuthenticated && (
          <>
            <Typography sx={drawerSectionLabelSx}>Explore</Typography>
            <List dense disablePadding sx={{ px: 1 }}>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  sx={drawerItemSx(pathname === "/")}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: WINE }}>
                    <HomeIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Home"
                    primaryTypographyProps={{ fontFamily: FONT, fontWeight: pathname === "/" ? 600 : 500 }}
                  />
                </ListItemButton>
              </ListItem>
              {unauthenticatedNavItems.map((item) => {
                const active = isNavActive(item.href);
                return (
                  <ListItem key={item.label} disablePadding>
                    <ListItemButton
                      component={Link}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      sx={drawerItemSx(active)}
                    >
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontFamily: FONT,
                          fontWeight: active ? 600 : 500,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </>
        )}

        {isAuthenticated && (
          <>
            <Typography sx={drawerSectionLabelSx}>Library</Typography>
            <List dense disablePadding sx={{ px: 1 }}>
              {authenticatedNavItems.map((item) => {
                const active = isNavActive(item.href);
                return (
                  <ListItem key={item.label} disablePadding>
                    <ListItemButton
                      component={Link}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      sx={drawerItemSx(active)}
                    >
                      <ListItemIcon sx={{ minWidth: 40, color: active ? WINE : alpha(DARK, 0.55) }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontFamily: FONT,
                          fontWeight: active ? 600 : 500,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>

            <Typography sx={drawerSectionLabelSx}>Account</Typography>
            <List dense disablePadding sx={{ px: 1, pb: 1 }}>
              {profileMenuItems.map(({ label, href, icon }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <ListItem key={label} disablePadding>
                    <ListItemButton
                      onClick={() => handleNavigate(href)}
                      sx={drawerItemSx(active)}
                    >
                      <ListItemIcon sx={{ minWidth: 40, color: active ? WINE : alpha(DARK, 0.55) }}>
                        {icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={label}
                        primaryTypographyProps={{
                          fontFamily: FONT,
                          fontWeight: active ? 600 : 500,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  sx={{
                    ...drawerItemSx(false),
                    color: "#B84A4A",
                    "&:hover": { bgcolor: alpha("#B84A4A", 0.06) },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: "#B84A4A" }}>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={isLoggingOut ? "Signing out…" : "Sign out"}
                    primaryTypographyProps={{ fontFamily: FONT, fontWeight: 500 }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </>
        )}
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${alpha(WINE, 0.08)}`,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          bgcolor: alpha(WINE, 0.02),
        }}
      >
        {!isAuthenticated ? (
          <>
            <Button
              component={Link}
              href="/auth/login"
              fullWidth
              onClick={() => setMobileOpen(false)}
              sx={{
                py: 1.35,
                borderRadius: 0,
                fontFamily: FONT,
                fontWeight: 500,
                color: WINE,
                border: `1px solid ${alpha(WINE, 0.2)}`,
              }}
            >
              Log in
            </Button>
            <Button
              component={Link}
              href="/auth/register"
              variant="contained"
              fullWidth
              endIcon={<ArrowForwardIcon />}
              onClick={() => setMobileOpen(false)}
              sx={{
                py: 1.35,
                borderRadius: 0,
                fontFamily: FONT,
                fontWeight: 600,
                bgcolor: WINE,
                color: CREAM,
                boxShadow: "none",
                "&:hover": { bgcolor: "#3D1C1C", boxShadow: "none" },
              }}
            >
              Start tracking
            </Button>
          </>
        ) : (
          <Button
            component={Link}
            href="/books/inProgress"
            variant="contained"
            fullWidth
            endIcon={<ArrowForwardIcon />}
            onClick={() => setMobileOpen(false)}
            sx={{
              py: 1.35,
              borderRadius: 0,
              fontFamily: FONT,
              fontWeight: 600,
              bgcolor: GREEN,
              color: "#FFFFFF",
              boxShadow: "none",
              "&:hover": { bgcolor: "#4CAD02", boxShadow: "none" },
            }}
          >
            Add book
          </Button>
        )}
      </Box>
    </Box>
  );

  const drawerSlotProps = {
    paper: {
      sx: {
        borderRadius: 0,
        boxShadow: "0 8px 40px rgba(30, 22, 18, 0.18)",
      },
    },
    backdrop: {
      sx: { bgcolor: alpha(DARK, 0.45) },
    },
  };

  const barInner = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        minHeight: { xs: 52, md: 56 },
        position: "relative",
      }}
    >
      <KatalogLogo
        href={isAuthenticated ? "/dashboard" : "/"}
        size={isMobile ? "sm" : "md"}
        variant={isDarkNav ? "light" : "dark"}
        showTagline={!isMobile && !isAuthPage}
      />

      {!isMobile && desktopNavLinks}

      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.75, sm: 1 }, ml: "auto" }}>
        {!isMobile && authActions}
        {isMobile && isAuthenticated && (
          <IconButton
            component={Link}
            href="/books/inProgress"
            aria-label="Add book"
            sx={mobileIconButtonSx(isDarkNav)}
          >
            <ReadingIcon fontSize="small" />
          </IconButton>
        )}
        {isMobile && (
          <IconButton
            onClick={handleDrawerToggle}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            sx={mobileIconButtonSx(isDarkNav)}
          >
            {mobileOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
          </IconButton>
        )}
      </Box>
    </Box>
  );

  if (isLoading) {
    return (
      <Box
        component="header"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          bgcolor: DARK,
          borderBottom: `1px solid ${alpha(CREAM, 0.08)}`,
        }}
      >
        <Container maxWidth="lg" sx={{ py: 1.25, px: { xs: 2, md: 3 } }}>
          <KatalogLogo
            href="/"
            size={isMobile ? "sm" : "md"}
            variant="light"
            showTagline={!isMobile && !isAuthPage}
          />
        </Container>
      </Box>
    );
  }

  if (isDarkNav) {
    return (
      <>
        <Box
          component="header"
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            bgcolor: DARK,
            borderBottom: `1px solid ${alpha(CREAM, 0.08)}`,
          }}
        >
          <Container maxWidth="lg" sx={{ py: 1.25, px: { xs: 2, md: 3 } }}>
            {barInner}
          </Container>
        </Box>
        <Box sx={{ height: { xs: 72, md: 76 } }} aria-hidden="true" />
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          slotProps={drawerSlotProps}
        >
          {mobileDrawer}
        </Drawer>
        {isAuthenticated && !isMobile && accountMenu}
      </>
    );
  }

  return (
    <>
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1100,
          bgcolor: alpha(CREAM, 0.95),
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${alpha(WINE, 0.08)}`,
        }}
      >
        <Container maxWidth="lg" sx={{ py: 1.25, px: { xs: 2, md: 3 } }}>
          {barInner}
        </Container>
      </Box>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        slotProps={drawerSlotProps}
      >
        {mobileDrawer}
      </Drawer>
      {isAuthenticated && !isMobile && accountMenu}
    </>
  );
}
