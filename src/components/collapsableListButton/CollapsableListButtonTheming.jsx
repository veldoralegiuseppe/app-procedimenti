import { styled } from '@mui/system';
import ListItemButton from '@mui/material/ListItemButton';

export const CollapsableListItemButton = styled(ListItemButton)(({ theme }) =>({
    borderRadius: '8px',
    '&:hover':{
      backgroundColor: theme.palette.primary.light,
    }
}));