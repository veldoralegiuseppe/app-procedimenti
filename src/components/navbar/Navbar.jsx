import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '/src/assets/img/logo-medarb.png';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import logoM from '/src/assets/img/logo-m.png';



export default function ResponsiveAppBar({drawerWidth}) {

  const theme = useTheme()

  const Header = styled(AppBar)(({ theme }) =>({
    backgroundColor: 'white',
    boxShadow: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-end',
    }
  }));

  const HamburgerButton = styled(MenuIcon)({
    color: theme.palette.secondary.main,
    fontSize: '28px',
    borderRadius: '8px',
    padding: '3px',
    backgroundColor: 'transparent',
    transition: 'background-color .2s ease-in-out 0s, color .1s ease-in-out 0s',
    "&:hover": {
      backgroundColor: 'transparent',
      //backgroundColor: theme.palette.secondary.main,
      color: '#f7bc6f',
    }
  });

  const ReactiveToolbar = styled(Toolbar)({
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-end',
    }
  });

  /**
   * SIDE MENU
   */
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };
  
 
  const drawer = (
    <div>
      <Toolbar sx={{borderRightColor: 'transparent'}}>
        {/* <img src={logoM} width="24"/> */}
      </Toolbar>
        
      <Divider sx={{borderColor: 'transparent'}}/>
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
    </div>
  );

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: 'white' }}>
      <Header position="static">
        <ReactiveToolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ 
                display: { xs: 'block', sm: 'block', md: 'none', lg: 'none', xl: 'none' }, 
                "&:hover": { backgroundColor: 'transparent' },
                justifySelf: 'end',
              }}
          >
            <HamburgerButton/>
          </IconButton>
          <Box sx={{display: { xs: 'block', sm: 'block', md: 'block', lg: 'block', xl: 'block' }}}>
            <img src={logo} width="80"/>
          </Box>
        </ReactiveToolbar>
      </Header>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          //container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: 'white' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: 'white', border: 'none' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}