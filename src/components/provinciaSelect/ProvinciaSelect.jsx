import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Paper from "@mui/material/Paper";

export default function ProvinciaSelect(props) {
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [items, setItems] = React.useState([]);
    const theme = useTheme()
    const labelColor = 'rgb(105 105 105 / 60%)'

    React.useEffect(() => {
        fetch("https://axqvoqvbfjpaamphztgd.functions.supabase.co/province")
          .then(res => res.json())
          .then(
            (result) => {
              result.push({nome: "Stato estero", sigla:"EE"}, {nome: "Dizioni storiche anpr", sigla:"DA"})
              setIsLoaded(true);
              setItems(result);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              setIsLoaded(true);
              setError(error);
            }
          )
      }, [])


    if(error)
        return (
            <CssTextField
            size='small'
            id="outlined-required-provincia-nascita"
            label={props.label ? props.label : "Provincia"}
            defaultValue=""
            sx={{...props.sx}}
            />
        )
    else 
        return(
            <Autocomplete
            disablePortal
            id="combo-box-demo"
            noOptionsText={'Nessun risultato'}
            options={items}
            getOptionLabel={(option) => option.nome.toLocaleUpperCase()}
            PaperComponent={({ children }) => (
                <Paper sx={{backgroundColor: theme.palette.dropdown.primary}}>{children}</Paper>
            )}
            renderOption={(props, option) =>  <li {...props} style={{color: theme.palette.primary.main, fontSize: '.9rem', fontWeight:'400'}}>{String(option.nome).toLocaleUpperCase()}</li>}
            sx={{...props.sx, display:'inline-block', }}
            onChange={(event, value) => {
                //console.log(value)
                props.onChange(value)
            }}
            renderInput={(params) => 
                <CssTextField {...params} 
                //required
                //error={error}
                //helperText={helperText}
                label={props.label ? props.label : "Provincia"}
                size='small'
                sx={{'& .MuiOutlinedInput-input':{fontWeight: '500'}, '& .MuiFormLabel-root':{color: labelColor}, }}
                //defaultValue={reset ? resetSede() : ""}
                />
              }
            />
        )

}

const CssTextField = styled(TextField)(({ theme }) => ({

    //  '& .MuiInputLabel-root[data-shrink="true"]':{
    //     color: theme.palette.logo.secondary,
  
    //     '& ~ .MuiInputBase-root fieldset':{ borderColor: theme.palette.logo.secondary,}
    //   },
      '& .MuiInputLabel-root.Mui-focused, & .MuiFormLabel-root.Mui-focused':{ color: theme.palette.logo.secondary,},
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


