export * from './CollapsableListButton';
export * from './ImportoReadOnly';
export * from './MainTheme';
export * from './Navbar';
export * from './styled/ClearButton';
export * from './styled/ContentGrid';
export * from './styled/CssSelect';
export * from './styled/CssTextField';

// TODO: DA RIFATTORIZZARE
export const labelColor = 'rgb(105 105 105 / 60%)';
export const labelDisableColor = 'rgb(148 148 148 / 60%)';
export const formControlStyles = (theme, labelColor) => ({
  minWidth: '133.5px',
  maxWidth: '168px',
  margin: '14px 20px 10px 0px',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderWidth: '1px', // Imposta lo spessore del bordo a 1px
    },
    '&:hover fieldset': {
      borderColor: theme.palette.logo.secondary, // Colore del bordo su hover
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.logo.secondary, // Colore del bordo su focus
      borderWidth: '1px', // Mantiene lo spessore del bordo a 1px anche in focus
    },
  },
  '&:hover .MuiInputLabel-root:not(.Mui-disabled, .Mui-error)': {
    color: theme.palette.logo.secondary, // Cambia il colore della label su hover
  },
  '& .MuiInputLabel-outlined.Mui-focused': {
    color: theme.palette.logo.secondary, // Cambia il colore della label quando è in focus
  },
  '& .MuiInputLabel-outlined.Mui-disabled': {
    color: theme.palette.text.disabled, // Colore della label quando è disabilitata
  },
  '& .MuiInputLabel-outlined': {
    transform: 'translate(14px, 8px) scale(1)', // Posizionamento centrato di default
  },
  '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
    transform: 'translate(14px, -8px) scale(0.75)', // Posizionamento della label ridotta
  },
  '& .MuiSvgIcon-root': {
    fill: labelColor, // Cambia il colore dell'icona della freccia di default
  },
  '&:hover .MuiSvgIcon-root, &.Mui-focused .MuiSvgIcon-root': {
    fill: theme.palette.logo.secondary, // Cambia il colore dell'icona su hover e focus
  },
});
