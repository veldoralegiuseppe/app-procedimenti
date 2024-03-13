import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import { Button } from '@mui/material';

export const CssTextField = styled(TextField)(({ theme }) => ({

  //  '& .MuiInputLabel-root[data-shrink="true"]':{
  //     color: theme.palette.logo.secondary,

  //     '& ~ .MuiInputBase-root fieldset':{ borderColor: theme.palette.logo.secondary,}
  //   },

    '& .MuiInputLabel-root.Mui-focused':{ color: theme.palette.logo.secondary,},
    '& .MuiOutlinedInput-root': {
      'input':{textTransform: 'uppercase'},
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

export const ClearButton = styled(Button)(({ theme }) =>({
  // '&':{
  //   color: '#467bae61',
  //   border: `1px solid #467bae61`,
  // },

  // '& .MuiButtonBase-root span svg':{
  //   fill: '#467bae61',
  // },

  '&.Mui-disabled':{
    backgroundColor: '#f4f4f4',
    borderColor: '#f1f1f1'
  },

}))