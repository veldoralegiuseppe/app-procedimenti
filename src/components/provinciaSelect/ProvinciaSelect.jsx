import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Paper from "@mui/material/Paper";

function ProvinciaSelect(props, ref) {
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [items, setItems] = React.useState([]);
    const [value, setValue] = React.useState(null)
    const theme = useTheme()
    const labelColor = 'rgb(105 105 105 / 60%)'
    const labelDisableColor = 'rgb(148 148 148 / 60%)'

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

    React.useImperativeHandle(ref, () => ({
            setProvincia(value){
                let result = null
                
                if(!value)
                    result = null
                else if(!value.nome && !value.sigla)
                    result = items.filter(p => p.nome.toLocaleUpperCase() == value.toLocaleUpperCase())[0]
                else if(value.nome && !value.sigla)
                    result = items.filter(p => p.nome.toLocaleUpperCase() == value.nome.toLocaleUpperCase())[0]
                else if(!value.nome && value.sigla)
                    result = items.filter(p => p.sigla.toLocaleUpperCase() == value.sigla.toLocaleUpperCase())[0]

                setValue(result)
            }
        })
    )
    

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
            disabled={props.disabled ? props.disabled : false}
            id="combo-box-demo"
            value={value}
            noOptionsText={'Nessun risultato'}
            options={items}
            getOptionLabel={(option) => option.nome.toLocaleUpperCase()}
            PaperComponent={({ children }) => (
                <Paper sx={{backgroundColor: theme.palette.dropdown.primary}}>{children}</Paper>
            )}
            renderOption={(props, option) =>  <li {...props} style={{color: theme.palette.primary.main, fontSize: '.9rem', fontWeight:'400'}}>{String(option.nome).toLocaleUpperCase()}</li>}
            sx={{...props.sx, display:'inline-block', }}
            onChange={(event, value) => {
                setValue(value)
                props.onChange(value)
            }}
            renderInput={(params) => 
                <CssTextField {...params} 
                //required
                //error={error}
                //helperText={helperText}
                label={props.label ? props.label : "Provincia"}
                size='small'
                disabled={props.disabled}
                sx={{'& .MuiOutlinedInput-input':{fontWeight: '500'}, '& .MuiFormLabel-root:not(.Mui-error, .Mui-focused, .Mui-disabled)':{color: labelColor}, '& .MuiFormLabel-root.Mui-disabled':{color: labelDisableColor},}}
                helperText={props.helperText}
                //defaultValue={reset ? resetSede() : ""}
                />
              }
            />
        )

}

const CssTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputLabel-root.Mui-focused:not(.Mui-error), & .MuiFormLabel-root.Mui-focused:not(.Mui-error)': {
      color: theme.palette.logo.secondary,
    },
    '& .MuiOutlinedInput-root': {
      input: { textTransform: 'uppercase' },
      '&.Mui-disabled': { backgroundColor: '#efefef73' },
      '&.Mui-disabled fieldset': { borderColor: '#eaeaea' },
      '&:hover:not(.Mui-disabled, .Mui-error) fieldset': {
        borderColor: theme.palette.logo.secondary,
      },
      '&.Mui-focused.Mui-error fieldset': { borderWidth: '1.2px' },
      '&.Mui-focused:not(.Mui-error) fieldset': { border: `1.2px solid ${theme.palette.logo.secondary}` },
      '&.Mui-focused:not(.Mui-error) .MuiInputAdornment-root .MuiSvgIcon-root': {
        fill: `${theme.palette.logo.secondary} !important`,
      },
      '& .MuiSvgIcon-root': {
        fill: theme.palette.text.primary, // Colore di default della freccia
      },
      '&:hover .MuiSvgIcon-root, &.Mui-focused .MuiSvgIcon-root': {
        fill: theme.palette.logo.secondary, // Colore secondario quando selezionato o su hover
      },
    },
  }));


export default React.forwardRef(ProvinciaSelect)