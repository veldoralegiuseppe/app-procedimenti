import { styled } from '@mui/system';
import AppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import ListItemButton from '@mui/material/ListItemButton';

export const Header = styled(AppBar)(({ theme }) =>({
    backgroundColor: theme.palette.background.default,
    boxShadow: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-end',
    }
}));

export const HamburgerButton = styled(MenuIcon)(({ theme }) =>({
    color: theme.palette.secondary.main,
    fontSize: '28px',
    borderRadius: '8px',
    padding: '3px',
    backgroundColor: 'transparent',
    transition: 'background-color .2s ease-in-out 0s, color .1s ease-in-out 0s',
    "&:hover": {
      backgroundColor: 'transparent',
      //backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.light,
    }
}));

export const ReactiveToolbar = styled(Toolbar)(({ theme }) =>({
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-end',
    }
}));

export const NavbarListItemButton = styled(ListItemButton)(({ theme }) =>({
  borderRadius: '8px',
  '&:hover':{
    backgroundColor: theme.palette.primary.light,
  }
}));

  
