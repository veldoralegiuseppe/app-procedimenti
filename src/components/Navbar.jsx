import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// Importa i loghi
import logo from '@assets/img/logo2.png'; // Logo MedArb
import repubblicaLogo from '@assets/img/logo-repubblica-blu.png'; // Logo Repubblica Italiana

// Sezioni di navigazione (menu)
const navItems = {
  'Dashboard': {route: '/dashboard'},
  'Procedimento': {route: '/procedimento/crea'},
  'Parti': {route: '/parti'},
}



function DrawerAppBar({onButtonClick}) {

  const handleButtonClick = (event) => {
    const btnLabel = event.target.value;
    onButtonClick(navItems[btnLabel].route)
  }
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />

      {/* Sezione superiore: nome azienda, sottotitolo e logo della Repubblica */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#f1f4f6', // Sfondo bianco
          boxShadow: 'none',
          borderBottom: '1px solid #ccc', // Separazione sottile
          justifyContent: 'center',
        }}
      >
        <Toolbar
          sx={{
            maxHeight: '90px',
            px: 2,
            display: 'flex',
            justifyContent: 'space-between', // Logo MedArb a sinistra e logo Repubblica a destra
            alignItems: 'center',
            padding: '0 clamp(1px, 5%, 3rem) !important',
          }}
        >
          {/* Logo MedArb e Nome azienda */}
          <Box sx={{ display: 'flex', alignItems: 'center', height: '90px' }}>
            <img src={logo} alt="Logo MedArb" width="102px" height="97px" />

            {/* Nome e sottotitolo dell'azienda */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                marginBottom: '13px',
                marginLeft: '-0.5rem',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: '2.5rem',
                  color: '#192d4d', // Blu coerente con la navbar e il logo
                  fontWeight: 'bold',
                  letterSpacing: 1,
                }}
              >
                MedArb
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: '#192d4d', // Colore più leggero per il sottotitolo
                }}
              >
                Risoluzione Mediata delle Controversie
              </Typography>
            </Box>
          </Box>

          {/* Logo Repubblica Italiana a destra */}
          <Box sx={{ display: 'flex', alignItems: 'center', height: '90px', paddingBottom: '15px' }}>
            <img
              src={repubblicaLogo}
              alt="Logo Repubblica Italiana"
              width="54px"
              height="54px"
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sezione inferiore: pulsanti di navigazione senza icone */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#0D47A1', // Blu navy scuro per i pulsanti
          minHeight: '48px !important', // Altezza ridotta per adattarsi allo stile
          boxShadow: 'none',
        }}
      >
        <Toolbar
          sx={{
            minHeight: '48px !important',
            paddingLeft: '48px !important',
            justifyContent: 'start', 
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 3, // Spaziatura tra i pulsanti
            }}
          >
            {Object.keys(navItems).map((label) => (
              <Button
                key={label}
                value={label}
                sx={{
                  color: '#fff',
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
                onClick={handleButtonClick}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

// Tipi di PropTypes per il componente
DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;
