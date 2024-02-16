import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import { useTheme } from '@mui/material/styles';
import { CollapsableListItemButton } from '/src/components/collapsableListButton/CollapsableListButtonTheming.jsx';

export default function CollapsableListButton({label, children, icon}){
    const theme = useTheme()
    const [open, setOpen] = React.useState(true);
  
    const handleClick = () => {
      setOpen(!open);
    };

  
    return (
      <Box sx={{width: '100%'}}>
        <CollapsableListItemButton selected={!open} sx={{padding: '8px 10px'}} onClick={handleClick}>
          <ListItemIcon sx={{minWidth: '24px', color: theme.palette.text.secondary}}>
            {icon}
          </ListItemIcon>
          <ListItemText  sx={ {'& .MuiTypography-root':{fontSize: '0.9rem'}} } primary={label} />
          {!open ? <ExpandLess /> : <ExpandMore />}
        </CollapsableListItemButton>
        <Collapse in={!open} timeout='auto' unmountOnExit>
          <List component="div" disablePadding>
              {children}
          </List>
        </Collapse>
      </Box>
    )
}