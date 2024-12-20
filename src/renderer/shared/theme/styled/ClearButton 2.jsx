import { styled } from '@mui/system';
import { Button } from '@mui/material';

export const ClearButton = styled(Button)(({ theme }) => ({
    // '&':{
    //   color: '#467bae61',
    //   border: `1px solid #467bae61`,
    // },
  
    // '& .MuiButtonBase-root span svg':{
    //   fill: '#467bae61',
    // },
  
    '&.Mui-disabled': {
      backgroundColor: '#f4f4f4',
      borderColor: '#f1f1f1',
    },
  }));