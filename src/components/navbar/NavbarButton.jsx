import * as React from 'react';
import { NavbarListItemButton} from '/src/components/navbar/NavbarTheming.jsx';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

export default function NavbarButton({icon, label, isActive, handleClick}){

    return (
        <NavbarListItemButton selected={isActive} key={`provvedimenti`}  onClick={handleClick}>
            <ListItemIcon sx={{minWidth: '24px'}}> {icon} </ListItemIcon>
            <ListItemText primary={label} sx={ {'& .MuiTypography-root':{fontSize: '0.9rem'}} }/>
        </NavbarListItemButton>
    )
}