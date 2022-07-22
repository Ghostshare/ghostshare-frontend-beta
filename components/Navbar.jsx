import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";

const pages = ["what", "why", "how"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const styles = {
  versionIndicator: {
    color: "#1c3355",
    fontSize: "0.9rem",
    backgroundColor: "white",
    borderRadius: "12px",
    height: "21px",
    padding: "0px 7px",
  },
};

const Navbar = ({ color, shortVersion }) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const setColor = !!color ? { color: color } : { color: "black" };

  const betaVersion = (
    <Tooltip title="This application is currently in beta version, which is stable BUT not backed up by external audits. This means that we're opening this app for the purpose that a selected group of people can test our service in order to improve - even though the application  publicly available! Please take this into account when using this service.">
      <span style={styles.versionIndicator}>beta</span>
    </Tooltip>
  );

  return (
    <AppBar
      position="static"
      sx={{
        pt: 2,
        backgroundColor: "transparent",
        position: "absolute",
        position: "absolute",
        top: 0,
        zIndex: 100,
        boxShadow: "none",
      }}
    >
      <Container maxWidth="md">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
            <Image
              src="/ghost-icon.svg"
              height={50}
              width={50}
              alt="Ghost Logo"
            />
          </Box>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <div style={{ display: "inline-flex" }}>
              <Typography
                variant="h3"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 1,
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                GhostShare
              </Typography>
              {betaVersion}
            </div>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {!shortVersion ? (
                pages.map((page) => (
                  <MenuItem
                    key={page}
                    onClick={handleCloseNavMenu}
                    component="a"
                    href={`#${page}`}
                  >
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))
              ) : (
                <MenuItem onClick={handleCloseNavMenu} component="a" href="/">
                  <Typography textAlign="center">BACK HOME</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, flexGrow: 1 }}>
            <div style={{ display: "inline-flex" }}>
              <Typography
                variant="h3"
                noWrap
                component="a"
                href=""
                sx={{
                  mr: 1,
                  fontWeight: 700,
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                GhostShare
              </Typography>
              {betaVersion}
            </div>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "flex-end",
            }}
          >
            {!shortVersion ? (
              pages.map((page) => (
                <Button
                  size="large"
                  key={page}
                  href={`#${page}`}
                  onClick={handleCloseNavMenu}
                  sx={{
                    ...setColor,
                    my: 2,
                    mx: 1,
                    display: "block",
                    scrollBehavior: "smooth",
                  }}
                >
                  {page}
                </Button>
              ))
            ) : (
              <MenuItem onClick={handleCloseNavMenu} component="a" href="/">
                <Typography textAlign="center">BACK HOME</Typography>
              </MenuItem>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {!shortVersion && (
              <Tooltip title="Open settings">
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </Tooltip>
            )}
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
