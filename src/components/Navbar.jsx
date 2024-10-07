import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Tooltip } from '@mui/material';

// Import delle Material Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import GavelIcon from '@mui/icons-material/Gavel'; // Icona per Procedimenti
import HandshakeIcon from '@mui/icons-material/Handshake'; // Icona per Parti e Controparti
import logo from '@assets/img/logo2.png'; // Include corretto del logo

// Array costante che contiene i dettagli di ogni pulsante
const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon style={{ fontSize: '24px' }} />, route: '/dashboard' },
  { label: 'Procedimenti', icon: <GavelIcon style={{ fontSize: '24px' }} />, route: '/procedimenti/crea' },
  { label: 'Parti e Controparti', icon: <HandshakeIcon style={{ fontSize: '24px' }} />, route: '/parti-controparti' },
];

export default function ResponsiveAppBar({ drawerWidth = 60, onButtonClick }) {
  const [activeItem, setActiveItem] = React.useState("Dashboard");
  const [hoverIndex, setHoverIndex] = React.useState(null); // Per sapere su quale icona si sta passando il mouse

  const handleItemClick = (item) => {
    setActiveItem(item.label);
    if (item.route) onButtonClick(item.route);
  };

  // Gestisce il movimento del mouse su un ListItemButton
  const handleMouseEnter = (index) => {
    setHoverIndex(index);
  };

  // Gestisce quando il mouse esce da un ListItemButton
  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const drawer = (
    <div style={{ height: '100%' }}>
      <Toolbar
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 8px',
        }}
      >
        {/* Logo MedArb */}
        <img
          src={logo}
          width="68px"
          style={{
            marginRight: '1px',
            transition: 'width 0.3s ease-in-out',
          }}
          alt="Logo"
        />
      </Toolbar>

      <List
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: 'calc(100vh - 72px - 1px)',
          overflow: 'hidden',
          padding: '0',
        }}
      >
        {/* Loop sugli elementi del menu */}
        {menuItems.map((item, index) => {
          const isHovered = hoverIndex === index; // L'icona su cui il mouse è attualmente
          const iconScale = isHovered ? 'scale(1.5)' : 'scale(1)'; // Ingrandimento durante l'hover

          return (
            <ListItemButton
              key={item.label}
              disableRipple
              onMouseEnter={() => handleMouseEnter(index)} // Ingrandisce l'icona quando si passa sul ListItemButton
              onMouseLeave={handleMouseLeave} // Reset dell'icona quando si esce
              sx={{
                display: 'flex',
                justifyContent: 'center',
                padding: '8px 0', // Riduzione padding verticale
                cursor: 'default', // Il puntatore del mouse non cambia sull'intero bottone
                backgroundColor: 'transparent', // Rimuovi completamente il background color
                '&:hover': {
                  backgroundColor: 'transparent', // Nessun background color sull'hover
                },
              }}
            >
              {/* Contenitore solo per l'icona con onClick */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ListItemIcon
                  onClick={() => handleItemClick(item)} // Click valido solo sull'icona
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    transform: iconScale, 
                    transition: 'transform 0.2s ease-in-out',
                    minWidth: 0, 
                    cursor: 'pointer', 
                  }}
                >
                  <Tooltip title={item.label} placement="right">
                    {React.cloneElement(item.icon, {
                      sx: {
                        color: activeItem === item.label ? '#f0f4f8' : '#3e3e3e', 
                        transition: 'color 0.3s ease-in-out, transform 0.2s ease-in-out',
                      },
                    })}
                  </Tooltip>
                </ListItemIcon>
              </Box>
            </ListItemButton>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box sx={{ width: 0, height: 0 }}>
      <Drawer
        variant="permanent"
        open={true}
        sx={{
          width: '60px',
          height: '98vh',
          '& .MuiDrawer-paper': {
            width: '60px',
            background: 'linear-gradient(180deg, #d79659 0%, #b5651de8 100%)', // Colore semi-trasparente della navbar
            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)', // Ombra per dare profondità
            height: '98vh',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            margin: '7px 0 4px 6px',
            borderRadius: '18px',
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
