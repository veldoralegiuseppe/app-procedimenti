import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AppBar, Box, CssBaseline, Toolbar, Typography, Button } from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { keyframes } from '@mui/system';

// Importa i loghi
import logo from '@assets/img/logo2.png';
import repubblicaLogo from '@assets/img/logo-repubblica-blu.png';
import { routes } from '@context/Route';

// Definisci l'animazione `dropdownFadeIn` usando keyframes
const dropdownFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

function DrawerAppBar({ onButtonClick }) {
  const [openMenu, setOpenMenu] = useState(null);
  const menuRefs = useRef({});

  const handleMenuClick = (label, hasChildren) => {
    // Se il pulsante non ha figli, chiama direttamente onButtonClick
    if (!hasChildren) {
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

  useEffect(() => {
    if (openMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenu]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />
      <AppBar position="static" sx={{ backgroundColor: '#f1f4f6', boxShadow: 'none', borderBottom: '1px solid #ccc' }}>
        <Toolbar sx={{ maxHeight: '90px', px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Logo MedArb" width="102" height="97" />
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: -0.5 }}>
              <Typography variant="h5" sx={{ fontSize: '2.5rem', color: '#192d4d', fontWeight: 'bold' }}>MedArb</Typography>
              <Typography variant="subtitle1" sx={{ color: '#192d4d' }}>Risoluzione Mediata delle Controversie</Typography>
            </Box>
          </Box>
          <img src={repubblicaLogo} alt="Logo Repubblica Italiana" width="54" height="54" />
        </Toolbar>
      </AppBar>

      <AppBar position="static" sx={{ backgroundColor: '#0D47A1', minHeight: '48px !important', boxShadow: 'none' }}>
        <Toolbar sx={{ minHeight: '48px !important', px: 6 }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {routes.map((route) => (
              <div key={route.path} ref={(el) => (menuRefs.current[route.path] = el)} style={{ position: 'relative' }}>
                <Button
                  sx={{ color: '#fff', textTransform: 'none', fontSize: '1rem', display: 'flex', alignItems: 'center' }}
                  onClick={() => handleMenuClick(route.path, Boolean(route.children))}
                  endIcon={
                    route.children ? (
                      <KeyboardArrowDownOutlinedIcon
                        sx={{
                          transition: 'transform 0.3s ease',
                          transform: openMenu === route.path ? 'scaleY(-1)' : 'scaleY(1)',
                        }}
                      />
                    ) : null
                  }
                >
                  {route.label || ''}
                </Button>
                {/* Lista di elementi visibile solo quando il menu è aperto e ci sono children */}
                {openMenu === route.path && route.children && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      backgroundColor: '#e2eef6',
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                      borderRadius: 1,
                      zIndex: 10,
                      minWidth: '150px',
                      mt: 0.5,
                      animation: `${dropdownFadeIn} 0.3s forwards`,
                    }}
                  >
                    <Box sx={{ position: 'absolute', top: -6, left: 24, width: 18, height: 18, backgroundColor: '#e2eef6', transform: 'rotate(45deg)', borderRadius: 1 }} />
                    <ul style={{ padding: 0, margin: 0 }}>
                      {route.children.map((child, index) => (
                        <li key={index} style={{ listStyle: 'none' }}>
                          <a
                            href="#"
                            onClick={() => handleMenuItemClick(`${route.path}${child.path}`)}
                            style={{ display: 'block', padding: '8px 16px', color: '#0D47A1', textDecoration: 'none' }}
                          >
                            {child.label || ''}
                          </a>
                        </li>
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

DrawerAppBar.propTypes = {
  onButtonClick: PropTypes.func,
};

export default DrawerAppBar;
