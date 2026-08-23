import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'

import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'

import Logo from '../common/Logo.jsx'
import ThemeToggle from '../common/ThemeToggle.jsx'

const Navbar = ({
  links = [],
  onSidebarToggle,
  showLogout = false,
}) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const navigate = useNavigate()

  const menuOpen = Boolean(anchorEl)

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    // Remove authentication data
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    // Close mobile menu
    handleMenuClose()

    // Navigate to login
    navigate('/')
    showLogout = false
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        width: '100%',
      }}
    >
      <Toolbar
        sx={{
          height: {
            xs: 60,
            sm: 64,
            md: 68,
            lg: 72,
          },

          minHeight: 'unset',

          px: {
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
          },

          gap: {
            xs: 0.5,
            sm: 1,
            md: 1.5,
          },

          width: '100%',
          boxSizing: 'border-box',
        }}
      >

        {/* Mobile Sidebar Button */}
        <IconButton
          onClick={onSidebarToggle}
          aria-label="Toggle sidebar"
          sx={{
            display: {
              xs: 'inline-flex',
              md: 'none',
            },

            color: 'text.primary',
            flexShrink: 0,
          }}
        >
          <MenuRoundedIcon />
        </IconButton>


        {/* Logo */}
        <Box
          sx={{
            flexShrink: 0,
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',

            '& img': {
              maxWidth: {
                xs: 42,
                sm: 46,
                md: 50,
              },

              width: 'auto',
            },
          }}
        >
          <Logo />
        </Box>


        {/* Space */}
        <Box sx={{ flex: 1 }} />


        {/* Desktop Navigation */}
        <Box
          sx={{
            display: {
              xs: 'none',
              md: 'flex',
            },

            alignItems: 'center',

            gap: {
              md: 0,
              lg: 0.5,
              xl: 1,
            },

            mr: {
              md: 1,
              lg: 2,
            },
          }}
        >

          {links.map((link) => (
            <Button
              key={link.path}
              component={NavLink}
              to={link.path}
              end
              sx={{
                color: 'text.secondary',

                fontSize: {
                  md: '0.8rem',
                  lg: '0.875rem',
                  xl: '0.95rem',
                },

                px: {
                  md: 1,
                  lg: 1.25,
                  xl: 1.5,
                },

                minWidth: 'auto',

                '&.active': {
                  color: 'text.primary',
                  fontWeight: 700,
                },

                '&:hover': {
                  color: 'text.primary',
                  bgcolor: 'action.hover',
                },
              }}
            >
              {link.label}
            </Button>
          ))}

        </Box>


        {/* ========================= */}
        {/* Desktop Logout */}
        {/* ========================= */}

        {showLogout && (
          <Button
            onClick={handleLogout}
            startIcon={<LogoutRoundedIcon />}
            sx={{
              display: {
                xs: 'none',
                md: 'flex',
              },

              color: 'error.main',

              fontSize: {
                md: '0.8rem',
                lg: '0.875rem',
                xl: '0.95rem',
              },

              px: {
                md: 1,
                lg: 1.25,
                xl: 1.5,
              },

              minWidth: 'auto',

              borderRadius: 1.5,

              '&:hover': {
                bgcolor: 'error.main',
                color: '#fff',
              },
            }}
          >
            Logout
          </Button>
        )}


        {/* Theme Toggle */}
        <Box
          sx={{
            flexShrink: 0,

            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ThemeToggle />
        </Box>


        {/* Mobile Navigation Button */}
        <IconButton
          onClick={handleMenuOpen}
          aria-label="Open navigation menu"
          sx={{
            display: {
              xs: 'inline-flex',
              md: 'none',
            },

            color: 'text.primary',
            flexShrink: 0,
          }}
        >
          <MenuRoundedIcon />
        </IconButton>


        {/* ========================= */}
        {/* Mobile Navigation Menu */}
        {/* ========================= */}

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          slotProps={{
            paper: {
              sx: {
                mt: 1,

                minWidth: {
                  xs: 210,
                  sm: 240,
                },

                maxWidth: 'calc(100vw - 24px)',

                bgcolor: 'background.paper',
                color: 'text.primary',

                border: '1px solid',
                borderColor: 'divider',
              },
            },
          }}
        >

          {/* Mobile Links */}
          {links.map((link) => (
            <MenuItem
              key={link.path}
              component={NavLink}
              to={link.path}
              end
              onClick={handleMenuClose}
              sx={{
                py: 1.25,

                '&.active': {
                  color: 'primary.main',
                  fontWeight: 700,
                  bgcolor: 'action.selected',
                },
              }}
            >
              {link.label}
            </MenuItem>
          ))}


          {/* Mobile Logout */}
          {showLogout && (
            <>
              <Divider />

              <MenuItem
                onClick={handleLogout}
                sx={{
                  py: 1.25,

                  color: 'error.main',

                  '&:hover': {
                    bgcolor: 'error.main',
                    color: '#fff',
                  },
                }}
              >
                <LogoutRoundedIcon
                  fontSize="small"
                  sx={{
                    mr: 1.5,
                  }}
                />

                Logout
              </MenuItem>
            </>
          )}


          <Divider />


          {/* Mobile Theme Toggle */}
          <Box
            sx={{
              px: 2,
              py: 1.5,

              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box
              component="span"
              sx={{
                fontSize: '0.9rem',
                color: 'text.secondary',
              }}
            >
              Theme
            </Box>

            <ThemeToggle />
          </Box>

        </Menu>

      </Toolbar>
    </AppBar>
  )
}

export default Navbar