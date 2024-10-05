import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Tooltip } from '@mui/material';

// Import delle Material Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import GavelIcon from '@mui/icons-material/Gavel'; // Icona per Procedimenti
import HandshakeIcon from '@mui/icons-material/Handshake'; // Icona per Parti e Controparti
import logo from '@assets/img/logo2.png'; // Include corretto del logo

export default function ResponsiveAppBar({ drawerWidth = 240 }) {
  const [open, setOpen] = React.useState(false); // Stato per sidebar aperta o chiusa

  const handleDrawerToggle = () => {
    setOpen(!open); // Cambia stato apertura/chiusura
  };

  const drawer = (
    <div>
      <Toolbar
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: open ? '8px' : '0 8px',
          transition: 'padding 0.3s',
        }}
      >
        {/* Logo MedArb con larghezza fissa di 64px */}
        <img
          src={logo}
          width="64px" // Fissa la larghezza a 64px
          style={{
            transition: 'width 0.3s',
          }}
          alt="Logo"
        />
      </Toolbar>

      <Divider />
      <List>
        {/* Tooltip per le icone con effetto hover */}
        <Tooltip title="Dashboard" placement="right">
          <ListItem
            button
            sx={{
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: '#c1d1d9', // Tonalità leggermente più chiara per l'hover
                color: '#37474f', // Grigio scuro per l'hover
              },
            }}
          >
            <ListItemIcon sx={{ color: '#37474f' }}>
              <DashboardIcon /> {/* Icona Material per Dashboard */}
            </ListItemIcon>
            {open && <ListItemText primary="Dashboard" sx={{ color: '#37474f' }} />}
          </ListItem>
        </Tooltip>

        <Tooltip title="Procedimenti" placement="right">
          <ListItem
            button
            sx={{
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: '#c1d1d9', // Hover azzurro chiaro
                color: '#37474f',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#37474f' }}>
              <GavelIcon /> {/* Icona Material per Procedimenti */}
            </ListItemIcon>
            {open && <ListItemText primary="Procedimenti" sx={{ color: '#37474f' }} />}
          </ListItem>
        </Tooltip>

        <Tooltip title="Parti e Controparti" placement="right">
          <ListItem
            button
            sx={{
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: '#c1d1d9', // Hover azzurro chiaro
                color: '#37474f',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#37474f' }}>
              <HandshakeIcon /> {/* Icona Material per Parti e Controparti */}
            </ListItemIcon>
            {open && <ListItemText primary="Parti e Controparti" sx={{ color: '#37474f' }} />}
          </ListItem>
        </Tooltip>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Drawer (sidebar) con colore azzurro pallido #d9e1e8 e ombra */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 60,
          transition: 'width 0.3s',
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 60,
            transition: 'width 0.3s',
            backgroundColor: '#d9e1e8', // Colore azzurro pallido per la barra laterale
            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)', // Ombra per la barra laterale
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Contenuto principale con bordi arrotondati e ombreggiatura */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: open ? `calc(100% - ${drawerWidth}px)` : `calc(100% - 60px)`,
          transition: 'width 0.3s',
          borderRadius: '12px',
          backgroundColor: '#f9f9f9',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Ombra per il contenuto principale
        }}
      >
        <Toolbar />
        <div>Contenuto della pagina corrente</div>
      </Box>
    </Box>
  );
}
