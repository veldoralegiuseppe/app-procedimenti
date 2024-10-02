import { styled } from '@mui/system';
import AppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import ListItemButton from '@mui/material/ListItemButton';
import { Typography } from '@mui/material';

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
    color: theme.palette.primary.main,
    fontSize: '28px',
    borderRadius: '8px',
    padding: '3px',
    backgroundColor: theme.palette.primary.light,
    transition: 'background-color .2s ease-in-out 0s, color .1s ease-in-out 0s',
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
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
  color: theme.palette.text.primary,
  paddingLeft: '11px',

  '&:hover':{
    backgroundColor: theme.palette.primary.light,
  },

  "&.Mui-selected, &.Mui-selected:hover": {
    'svg':{ color: theme.palette.primary.main,},
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light,

    "& .MuiListItemText-primary":{fontWeight: '500'}
  }
}));

export const SectionText = styled(Typography)(({ theme }) =>({
  color: theme.palette.logo.primary, 
  fontFamily:'Public Sans', 
  fontWeight: '500', 
  fontSize: '0.9rem', 
  margin: '0 4px 10px 0',
  lineHeight: '1.66',

}));


  
