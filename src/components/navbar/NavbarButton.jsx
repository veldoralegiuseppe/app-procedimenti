import * as React from 'react';
import { NavbarListItemButton} from '/src/components/navbar/NavbarTheming.jsx';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';

export default function NavbarButton({icon, label, isActive, handleClick}){
    const theme = useTheme()

    return (
        <NavbarListItemButton selected={isActive} key={`provvedimenti`}  onClick={handleClick}>
            <ListItemIcon sx={{minWidth: '24px', color: theme.palette.text.secondary}}> {icon} </ListItemIcon>
            <ListItemText primary={label} sx={ {'& .MuiTypography-root':{fontSize: '0.9rem'}} }/>
        </NavbarListItemButton>
    )
}