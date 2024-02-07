import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import logo from '/src/assets/img/logo-medarb.png';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Typography } from '@mui/material';
import CollapsableListButton from '/src/components/collapsableListButton/CollapsableListButton.jsx'
import GridViewIcon from '@mui/icons-material/GridView';
import SourceOutlinedIcon from '@mui/icons-material/SourceOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import { Header, HamburgerButton, ReactiveToolbar,} from '/src/components/navbar/NavbarTheming.jsx';
import { useTheme } from '@mui/material/styles';
import logoM from '/src/assets/img/logo-m.png';
import NavbarButton from '/src/components/navbar/NavbarButton.jsx';


export default function ResponsiveAppBar({drawerWidth}) {

  const theme = useTheme()

  /**
   * BUTTONS
   */
  const [activeIndex, setActiveIndex] = React.useState(0);

  const dashboardView = (
    <NavbarButton key={'DashboardButton'} isActive={activeIndex === 0} handleClick={() => setActiveIndex(0)} icon={<GridViewIcon/>} label='Overview'>
    </NavbarButton>
  )

  const provvedimentiListItem = (
    ['Crea', 'Ricerca'].map((text, index) => (
        <NavbarButton key={'ProvvedimentiSubButton'+text} isActive={activeIndex === index+1} handleClick={() => setActiveIndex(index+1)} icon={text == 'Crea' ? <PostAddOutlinedIcon/> : <FindInPageOutlinedIcon/>} label={text}>
        </NavbarButton>
    ))
  )
  
  const partiListItem = (
    ['Crea', 'Ricerca'].map((text, index) => (
      <NavbarButton  key={'PartiSubButton'+text} isActive={activeIndex === index+3} handleClick={() => setActiveIndex(index+3)} icon={text == 'Crea' ? <PersonAddAltIcon/> : <PersonSearchOutlinedIcon/>} label={text}>
      </NavbarButton>
    ))
  )
  
  /**
   * DRAWER
   */
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const menuSection = [
  {sezione: 'Dashboard', sub: [{id:'Overview', view: dashboardView}]}, 
  {sezione: 'Gestisci', sub: [ 
      {id:'ProvvedimentiMain', view: <CollapsableListButton label='Provvedimenti' icon={<SourceOutlinedIcon/>}>{provvedimentiListItem}</CollapsableListButton>}, 
      {id: 'PartiMain', view: <CollapsableListButton label='Parti e controparti' icon={<PeopleOutlineIcon/>}>{partiListItem}</CollapsableListButton>},
    ]}
  ]

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
        <img src={logo} width="80"/>
      </Toolbar>
        
      <Divider sx={{borderColor: 'transparent'}}/>
        <List sx={{padding: '10px 4px 16px 4px'}}>
          {
            menuSection.map(s => (
              <Box key={s.sezione} sx={{padding: '10px 0px 5px 0'}}>
                <Typography sx={{color: 'rgb(145, 158, 171)', fontFamily:'Public Sans', fontWeight: '700', fontSize: '0.75rem', marginLeft: '5px'}} variant="h6">{s.sezione.toLocaleUpperCase()}</Typography>
                {s.sub.map((item, index) =>(
                  <ListItem key={item.id} disablePadding>
                    {item.view}
                  </ListItem>
                ))}
              </Box>
            ))
          }
        </List>
    </div>
  );

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: theme.palette.background.default}}>
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
            {/* <img src={logo} width="80"/> */}
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
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: theme.palette.background.default},
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none', backgroundColor: theme.palette.background.default},
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

