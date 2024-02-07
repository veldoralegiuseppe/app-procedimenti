import { styled } from '@mui/system';
import ListItemButton from '@mui/material/ListItemButton';

export const CollapsableListItemButton = styled(ListItemButton)(({ theme }) =>({
    borderRadius: '8px',
    color: '#6b6767',
    '&:hover':{
      backgroundColor: theme.palette.primary.light,
    },

    "&.Mui-selected, &.Mui-selected:hover": {
      'svg':{ color: theme.palette.primary.main,},
      color: theme.palette.primary.main,
      backgroundColor: 'transparent',
      "& .MuiListItemText-primary":{fontWeight: '700'}
    }
}));