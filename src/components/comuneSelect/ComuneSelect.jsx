import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Paper from "@mui/material/Paper";
import {COMUNI_ESTERI} from "/src/assets/js/comuni.js"
import { Comune } from '/src/vo/comune.js';
import { Provincia } from '/src/vo/provincia.js';

function ComuneSelect(props, ref) {
    const [error, setError] = React.useState(null)
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [provincia, setProvincia] = React.useState(null)
    const [items, setItems] = React.useState([])
    const [value, setValue] = React.useState(null)
    const theme = useTheme()
    const labelColor = 'rgb(105 105 105 / 60%)'
    const labelDisableColor = 'rgb(148 148 148 / 60%)'
    const options = {method: 'GET', headers: {accept: 'application/json'}};
    
    React.useImperativeHandle(ref, () => ({
        setComune(comune){
          let result = null
          if(comune && comune instanceof Comune) result = comune
          setProvincia(result ? result.provincia : null)
          setValue(result)
        },

        setProvincia(provincia){
          let result = null
          if(provincia && (typeof provincia === "string" || provincia.nome) && !(provincia instanceof Provincia)){
            result = new Provincia(typeof provincia === 'string' ? {nome: provincia} : {nome: provincia.nome})
          }
          if(!result) setValue(null)
          setProvincia(result)
          
        }
      })
    )

    React.useEffect(() => {
        if(!provincia || !provincia instanceof Provincia) return

        console.log(`Carico i comuni della provincia: ${JSON.stringify(provincia)}`)

        if(String(provincia.nome).toLocaleUpperCase () == 'STATO ESTERO'){
          setIsLoaded(true);
          setItems(Array.from(COMUNI_ESTERI, ([key, value]) => (new Comune({nome: value.denominazione, provincia: {nome: 'STATO ESTERO'}}))))
        }
        else {
          fetch(`https://axqvoqvbfjpaamphztgd.functions.supabase.co/comuni/provincia/${String(provincia.nome).toLocaleLowerCase()}?page=1`, options)
            .then(res => res.json())
            .then(
              (result) => {
                setIsLoaded(true);
                setItems( result.map(c => new Comune(c)) )
              },
              // Note: it's important to handle errors here
              // instead of a catch() block so that we don't swallow
              // exceptions from actual bugs in components.
              (error) => {
                setIsLoaded(true);
                setError(error);
              }
            )
        }
      }, [provincia])


    if(error)
        return (
            <CssTextField
            size='small'
            id="outlined-required-comune"
            label={props.label ? props.label : "Comune"}
            defaultValue=""
            sx={{...props.sx}}
            />
        )
    else 
        return(
            <Autocomplete
            disabled={!provincia || props.disabled}
            disablePortal
            value={value}
            isOptionEqualToValue={(option, value) => JSON.stringify(option) === JSON.stringify(value)}
            id="combo-box-demo"
            onChange={(event, value) => setValue(value)}
            noOptionsText={!provincia ? "Seleziona una provincia" : 'Nessun risultato'}
            options={items}
            getOptionLabel={(option) => option.nome.toLocaleUpperCase()}
            PaperComponent={({ children }) => (
                <Paper sx={{backgroundColor: theme.palette.dropdown.primary}}>{children}</Paper>
            )}
            renderOption={(props, option) =>  <li {...props} style={{color: theme.palette.primary.main, fontSize: '.9rem', fontWeight:'400'}}>{String(option.nome).toLocaleUpperCase()}</li>}
            sx={{...props.sx, display:'inline-block', }}
            renderInput={(params) => 
                <CssTextField {...params} 
                //required
                //error={error}
                disabled={props.disabled}
                helperText={props.disabled ? props.helperText : (!provincia ? "Seleziona una provincia per attivare questo campo" : "")}
                label={props.label ? props.label : "Comune"}
                size='small'
                sx={{'& .MuiOutlinedInput-input':{fontWeight: '500'}, '& .MuiFormLabel-root:not(.Mui-error, .Mui-focused, .Mui-disabled)':{color: labelColor}, '& .MuiFormLabel-root.Mui-disabled':{color: labelDisableColor}}}
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
      //'& .MuiInputLabel-root.Mui-disabled, & .MuiFormLabel-root.Mui-disabled':{ color: 'rgb(173 173 173 / 60%)',},
      '& .MuiOutlinedInput-root': {
          'input':{textTransform: 'uppercase'},
          '&:hover:not(.Mui-disabled) fieldset': {
              borderColor: theme.palette.logo.secondary,
          },
          '&.Mui-disabled':{backgroundColor: '#efefef73'},
          '&.Mui-disabled fieldset':{borderColor: '#eaeaea'},
          //'&.Mui-disabled fieldset':{borderColor: 'transparent', backgroundColor: '#f5f5f526'},
          '&.Mui-focused fieldset': {
              border: `1.2px solid ${theme.palette.logo.secondary}`,
          },
          '&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root': {
              fill: `${theme.palette.logo.secondary} !important`,
          },
      },
}));

export default React.forwardRef(ComuneSelect)
