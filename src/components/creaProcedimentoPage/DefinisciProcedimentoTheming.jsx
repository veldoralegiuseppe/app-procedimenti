import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';

export const CssTextField = styled(TextField)(({ theme }) => ({

  //  '& .MuiInputLabel-root[data-shrink="true"]':{
  //     color: theme.palette.logo.secondary,

  //     '& ~ .MuiInputBase-root fieldset':{ borderColor: theme.palette.logo.secondary,}
  //   },

    '& .MuiInputLabel-root.Mui-focused':{ color: theme.palette.logo.secondary,},
    '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
            borderColor: theme.palette.logo.secondary,
        },
        '&.Mui-focused fieldset': {
            border: `1.2px solid ${theme.palette.logo.secondary}`,
        },
        '&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root': {
            fill: `${theme.palette.logo.secondary} !important`,
        },
    },
  }));

  export const CssSelect = styled(Select)(({ theme }) => ({
  
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: `${theme.palette.logo.secondary}`,
      },
      '&:hover .MuiSvgIcon-root, &.Mui-focused .MuiSvgIcon-root': {
        fill: `${theme.palette.logo.secondary} !important`,
      },
      '& .MuiInputLabel-root.Mui-focused':{ color: `${theme.palette.logo.secondary} !important`,},
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        border: `1.2px solid ${theme.palette.logo.secondary}`,
    },
  }));