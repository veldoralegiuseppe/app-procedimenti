import { styled } from '@mui/system';
import Grid from '@mui/material/Grid2';

export const ContentGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: '16px',
  [theme.breakpoints.down('md')]: {
    margin: `0 19px`,
  },
}));
