import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  SvgIcon,
} from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

import logo from '@assets/img/logo2.png';
import repubblicaLogo from '@assets/img/logo-repubblica-blu.png';
import { routes } from '@context/Route';
import {
  StyledLi,
  StyledLink,
  LinkText,
  StyledButton,
  dropdownFadeIn,
} from '@theme/Navbar';

function Navbar({ onButtonClick }) {
  // Layout
  const menuBackgroundColor = '#cfe6f6';

  // State
  const [openMenu, setOpenMenu] = useState(null);

  // Ref
  const menuRefs = useRef({});

  // Handle
  const handleMenuClick = (label, hasChildren) => {
    if (!hasChildren) {
      setOpenMenu(null);
      onButtonClick(label);
    } else {
      setOpenMenu(openMenu === label ? null : label);
    }
  };
  const handleMenuItemClick = (route) => {
    setOpenMenu(null);
    onButtonClick(route);
  };
  const handleClickOutside = (event) => {
    const clickedInsideMenu = Object.values(menuRefs.current).some(
      (ref) => ref && ref.contains(event.target)
    );
    if (!clickedInsideMenu) {
      setOpenMenu(null);
    }
  };

  // Effect
  useEffect(() => {
    if (openMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenu]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />
      {/* Logo Medarb, Repubblica */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#f1f4f6',
          boxShadow: 'none',
          borderBottom: '1px solid #ccc',
        }}
      >
        <Toolbar
          sx={{
            maxHeight: '90px',
            px: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Logo MedArb" width="102" height="97" />
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: -0.5 }}>
              <Typography
                variant="h5"
                sx={{
                  fontSize: '2.5rem',
                  color: '#192d4d',
                  fontWeight: 'bold',
                  lineHeight: '15px',
                  marginBottom: '12px',
                }}
              >
                MedArb
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#192d4d' }}>
                Risoluzione Mediata delle Controversie
              </Typography>
            </Box>
          </Box>
          <img
            src={repubblicaLogo}
            alt="Logo Repubblica Italiana"
            width="54"
            height="54"
            style={{ marginBottom: '12px' }}
          />
        </Toolbar>
      </AppBar>

      {/* Navigation buttons */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#0D47A1',
          minHeight: '48px !important',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ minHeight: '48px !important', px: 6 }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {routes.map((route) => (
              <div
                key={route.path}
                ref={(el) => (menuRefs.current[route.path] = el)}
                style={{ position: 'relative' }}
              >
                <StyledButton
                  disableRipple
                  onClick={() =>
                    handleMenuClick(route.path, Boolean(route.children))
                  }
                  endIcon={
                    route.children ? (
                      <KeyboardArrowDownOutlinedIcon
                        sx={{
                          transition: 'transform 0.3s ease',
                          transform:
                            openMenu === route.path
                              ? 'scaleY(-1)'
                              : 'scaleY(1)',
                        }}
                      />
                    ) : null
                  }
                >
                  {route.label || ''}
                </StyledButton>
                {/* Lista di elementi visibile solo quando il menu è aperto e ci sono children */}
                {openMenu === route.path && route.children && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      backgroundColor: menuBackgroundColor,
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                      borderRadius: 1,
                      zIndex: 10,
                      minWidth: '180px',
                      maxWidth: '250px',
                      mt: '10px',
                      animation: `${dropdownFadeIn} 0.3s forwards`,
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -6,
                        left: 24,
                        width: 18,
                        height: 18,
                        backgroundColor: menuBackgroundColor,
                        transform: 'rotate(45deg)',
                        borderRadius: 1,
                      }}
                    />
                    <ul style={{ padding: '4px 0', margin: 0 }}>
                      {route.children.map((child, index) => (
                        <StyledLi key={`${route.path}-${child.path}`}>
                          {child.icon && (
                            <SvgIcon
                              sx={{ color: '#0D47A1', fontSize: '20px' }}
                            >
                              {child.icon}
                            </SvgIcon>
                          )}
                          <StyledLink
                            href="#"
                            onClick={() =>
                              handleMenuItemClick(`${route.path}${child.path}`)
                            }
                          >
                            <LinkText className="link-text">
                              {child.label || ''}
                            </LinkText>
                          </StyledLink>
                        </StyledLi>
                      ))}
                    </ul>
                  </Box>
                )}
              </div>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

Navbar.propTypes = {
  onButtonClick: PropTypes.func,
};

export default Navbar;
