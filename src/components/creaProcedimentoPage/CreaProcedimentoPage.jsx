import * as React from 'react';
import {AppContext} from '/src/store/app-context.jsx';
import Breadcrumbs from "/src/components/breadcrumbs/Breadcrumbs.jsx";
import { Typography } from '@mui/material';
import HorizontalLinearStepper from '/src/components/stepper/Stepper.jsx';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { itIT } from '@mui/x-date-pickers/locales';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SedeSelect from '/src/components/creaProcedimentoPage/SedeSelect.jsx';
import "dayjs/locale/it";
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import InputAdornment from '@mui/material/InputAdornment';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';
import { CssTextField, CssSelect} from './DefinisciProcedimentoTheming.jsx';
import { useTheme } from '@mui/material/styles';
import Paper from "@mui/material/Paper";


export default function CreaProvvedimento(){

    var {currentPath} = React.useContext(AppContext);
    const steps = [
        {label: 'Definisci il procedimento', component: <DefinisciProcedimento/>}, 
        {label: 'Definisci le parti', component: 'Definisci parti'}, 
        {label: 'Create an ad', component: 'Finale'}
    ];  
    const theme = useTheme()

    function getCurrentPage(){
        var regex = /\/[a-zA-Z]+/g
        var subPath = currentPath.match(regex)
        return camelCase(subPath[subPath.length -1 ].replaceAll('/',''))
    }

    return(
        <div style={{display: 'flex', flexDirection: 'column', flex: '1', rowGap: '5rem'}}>
            <div style={{display: 'flex', backgroundColor: 'white', justifyContent: 'space-between', height: '56px', alignItems: 'center', padding: '0 16px', borderRadius: '8px'}}>
                <Typography variant="h5" sx={{fontWeight: '600', fontSize: '1.25rem', color: theme.palette.logo.secondary}}>{getCurrentPage()}</Typography>
                <Breadcrumbs></Breadcrumbs>
            </div>

            <HorizontalLinearStepper steps={steps}></HorizontalLinearStepper>
        </div>
    )
}

/**
 * Pagina associata allo step 'Definisci procedimento'
 * @returns 
 */
function DefinisciProcedimento(){
    const inputWidth = '132.5px'
    const backgroundColor = 'rgb(248,250,252)'
    const formLabelFontSize = '1rem'
    const theme = useTheme()

     // FORM SELECT PROVA
    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    return (
        <>
        {/* Procedimento di mediazione */}
        <Grid xs={12}>
        <Grid xs={12}><Typography variant="h6" sx={{fontWeight: '600', fontSize: formLabelFontSize, padding: '0 0 0 1rem' }}>Procedimento di Mediazione</Typography></Grid>
        
        <CssTextField sx={{margin: '10px', backgroundColor: backgroundColor, width: inputWidth}} id="outlined-basic" label="Numero" variant="outlined" size='small' required/>

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='it' localeText={itIT.components.MuiLocalizationProvider.defaultProps.localeText}>
            <MobileDatePicker 
            label='Data deposito'
            sx={{margin: '10px', backgroundColor: backgroundColor, width: inputWidth}}
            slots={{textField: CssTextField}}
            slotProps={{
                textField: {
                    InputProps: {
                    endAdornment: (
                        <InputAdornment position="end">
                        <CalendarMonthOutlinedIcon />
                        </InputAdornment>
                    ),
                    },
                    size: 'small',
                },
            }}
            />
        </LocalizationProvider>

        <SedeSelect inputWidth={inputWidth} backgroundColor={backgroundColor}></SedeSelect>

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='it' localeText={itIT.components.MuiLocalizationProvider.defaultProps.localeText}>   
            <MobileDateTimePicker
            label='Data incontro'
            sx={{margin: '10px', backgroundColor: backgroundColor, width: inputWidth}}
            slots={{textField: CssTextField}}
            slotProps={{
                textField: {
                    InputProps: {
                    endAdornment: (
                        <InputAdornment position="end">
                        <QueryBuilderOutlinedIcon />
                        </InputAdornment>
                    ),
                    },
                    size: 'small'
                },
                }}
            />
        </LocalizationProvider>

        </Grid>

        {/* Controversia */}
        <Grid xs={12}>
            <Grid xs={12}><Typography variant="h6" sx={{fontWeight: '600', fontSize: formLabelFontSize, padding: '0 0 0 1rem' }}>Controversia</Typography></Grid>

            <FormControl size='small' sx={{width: inputWidth, margin: '10px', backgroundColor: backgroundColor}}>
                    <InputLabel id="oggetto-controversia-input-label">Oggetto</InputLabel>
                    <CssSelect
                    labelId="oggetto-controversia-input-label"
                    id="oggetto-controversia-select"
                    value={age}
                    inputProps={{
                        MenuProps: {
                            MenuListProps: {
                                sx: {
                                    backgroundColor: theme.palette.primary.light,
                                    color: theme.palette.primary.main,
                                }
                            },
                            PaperProps: {
                                sx: {
                                  '& .MuiMenuItem-root': {
                                    //padding: '1rem',
                                    fontSize: '.9rem',
                                    fontWeight: '500',
                                  },
                                },
                            },
                        },
                    }}
                    label="Oggetto"
                    size='small'
                    onChange={handleChange}
                    >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                    </CssSelect>
            </FormControl>

            <CssTextField 
                InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                    <EuroSymbolIcon />
                    </InputAdornment>
                ),
                }}
            sx={{margin: '10px', backgroundColor: 'rgb(248,250,252)', width: inputWidth}} 
            id="outlined-basic" 
            label="Valore della controversia" 
            variant="outlined" 
            size='small' 
            required/>
        </Grid>
        </>
    )
}

/**
 * Function to convert into camel Case
 * @param {string} str Stringa
 * @returns Stringa camelCase
 */
function camelCase(str) {
    return str.substring(0,1).toLocaleUpperCase() + str.substring(1)
}