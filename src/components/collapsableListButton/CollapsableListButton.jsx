import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';

export default function CollapsableListButton({label, children, icon}){
    const [open, setOpen] = React.useState(true);
  
    const handleClick = () => {
      setOpen(!open);
    };
  
    return (
      <Box sx={{width: '100%'}}>
        <ListItemButton sx={{padding: '8px 10px'}} onClick={handleClick}>
          <ListItemIcon sx={{minWidth: '24px'}}>
            {icon}
          </ListItemIcon>
          <ListItemText primary={label} />
          {!open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={!open} timeout='auto' unmountOnExit>
          <List component="div" disablePadding>
              {children}
              <ListItemButton sx={{padding: '8px 10px'}}>
              </ListItemButton>
          </List>
        </Collapse>
      </Box>
    )
}