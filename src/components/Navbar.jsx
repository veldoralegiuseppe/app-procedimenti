import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import logo from '/src/assets/img/logo-medarb.png';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import GridViewIcon from '@mui/icons-material/GridView';
import SourceOutlinedIcon from '@mui/icons-material/SourceOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';

import { RouteContext, routes } from '@context/Route';
import CollapsableListButton from '@components/CollapsableListButton'
import { Header, HamburgerButton, ReactiveToolbar, SectionText, NavbarListItemButton } from '@theme/Navbar';

function NavbarButton({icon, label, isActive, handleClick}){
  const theme = useTheme()

  return (
      <NavbarListItemButton selected={isActive} key={`provvedimenti`}  onClick={handleClick}>
          <ListItemIcon sx={{minWidth: '24px', color: theme.palette.text.secondary}}> {icon} </ListItemIcon>
          <ListItemText primary={label} sx={ {'& .MuiTypography-root':{fontSize: '0.9rem'}} }/>
      </NavbarListItemButton>
  )
}

export default function ResponsiveAppBar({drawerWidth, onButtonClick}) {

  var {currentPath} = React.useContext(RouteContext);
  const theme = useTheme()

  /**
   * DRAWER
   */
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  /**
   * Costriusce i button del menu in funzione dei path specificati. I path che prevedono dei children sono tradotti in dei collapsable
   * @param {string} root root del path
   * @returns view
   */
  function buildView(root){
    const pathButtonMap = new Map()
    pathButtonMap.set('/dashboard', {label: 'Overview', icon: <GridViewIcon/>})
    pathButtonMap.set('/procedimenti', {label: 'Procedimenti', icon: <SourceOutlinedIcon/>})
    pathButtonMap.set('/procedimenti/crea', {label: 'Crea', icon: <PostAddOutlinedIcon/>})
    pathButtonMap.set('/procedimenti/cerca', {label: 'Cerca', icon: <FindInPageOutlinedIcon/>})
    pathButtonMap.set('/parti', {label: 'Parti e controparti', icon: <PeopleOutlineIcon/>})
    pathButtonMap.set('/parti/crea', {label: 'Crea', icon: <PersonAddAltIcon/>})
    pathButtonMap.set('/parti/cerca', {label: 'Cerca', icon: <PersonSearchOutlinedIcon/>})

    function NavButton(key, path, {icon, label}){
      return (
        <NavbarButton key={key} isActive={currentPath === path} handleClick={() => onButtonClick(path)} icon={icon} label={label}>
        </NavbarButton>
      )
    }

    function WrapNavButton(children,{icon, label}, path){
      return <CollapsableListButton key={path} label={label} icon={icon}>{children}</CollapsableListButton>
    }
    
    if(routes) 
      return routes.filter(r => r.path === root).map(r => {
       
        if(r.children){ 
          return WrapNavButton(  r.children.map(c => NavButton(r.path+c.path, r.path+c.path, pathButtonMap.get(r.path+c.path))), pathButtonMap.get(r.path), r.path )
        }
        else
          return NavButton(r.path, r.path, pathButtonMap.get(r.path)) 
    })
    else <></>
  }

  const menu = [
    {sezione: 'Dashboard', sub: [{key:'Overview', view: buildView('/dashboard')}]}, 
    {sezione: 'Gestisci', sub: [ 
        {key:'ProcedimentiMain', view: buildView('/procedimenti')}, 
        {key: 'PartiMain', view: buildView('/parti')},
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
      <Toolbar sx={{borderRightColor: 'transparent', justifyContent: 'center', paddingLeft: '10px !important'}}>
        <img src={logo} width="102"/>
      </Toolbar>
        
      <Divider sx={{borderColor: 'transparent'}}/>
        <List sx={{padding: '9px 11px 16px 11px', '& .MuiBox-root:not(:first-of-type)':{paddingTop: '10px'} }}>
          {
            menu.map(s => (
              <Box key={s.sezione}>
                <SectionText>{s.sezione.toLocaleUpperCase()}</SectionText>
                {s.sub.map((item, index) =>(
                  <ListItem key={item.key} disablePadding>
                    {item.view}
                  </ListItem>
                ))}
                   <Divider  sx={{marginTop: '10px'}} />
              </Box>
            ))
          }
        </List>
    </div>
  );

  return (
    <Box sx={{ flexGrow: 0, backgroundColor: theme.palette.background.default}}>
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

