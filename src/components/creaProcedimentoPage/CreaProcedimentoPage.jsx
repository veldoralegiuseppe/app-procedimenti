import * as React from 'react';
import {AppContext} from '/src/store/app-context.jsx';
import Breadcrumbs from "/src/components/breadcrumbs/Breadcrumbs.jsx";
import { Typography } from '@mui/material';
import HorizontalLinearStepper from '/src/components/stepper/Stepper.jsx';
import Grid from '@mui/material/Unstable_Grid2';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { itIT } from '@mui/x-date-pickers/locales';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import SedeSelect from '/src/components/creaProcedimentoPage/SedeSelect.jsx';
import "dayjs/locale/it";
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import InputAdornment from '@mui/material/InputAdornment';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';
import { CssTextField, CssSelect} from './DefinisciProcedimentoTheming.jsx';
import { useTheme } from '@mui/material/styles';


export default function CreaProvvedimento(){

    var {currentPath} = React.useContext(AppContext);
    const steps = [
        {label: 'Definisci il procedimento', component: <DefinisciProcedimento/>}, 
        {label: 'Definisci le parti', component: 'Definisci parti'}, 
        {label: 'Riepilogo', component: 'Finale'}
    ];  
    const theme = useTheme()

    function getCurrentPage(){
        var regex = /\/[a-zA-Z]+/g
        var subPath = currentPath.match(regex)
        return camelCase(subPath[subPath.length -1 ].replaceAll('/',''))
    }

    return(
        <div style={{display: 'flex', flexDirection: 'column', flex: '1', rowGap: '5rem'}}>
            <div style={{display: 'flex', backgroundColor: theme.palette.background.default, justifyContent: 'space-between', height: '56px', alignItems: 'center', padding: '0 16px', borderRadius: '8px'}}>
                <Typography variant="h5" sx={{fontWeight: '400', fontSize: '1.4rem', color: theme.palette.text.primary}}>Crea Procedimento</Typography>
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
    const theme = useTheme()
    const inputWidth = '20%'
    const minWidth = '133.5px'
    const maxWidth = '200px'
    const margin = '18px 20px 10px 10px'
    const backgroundColor = theme.palette.background.default
    const formLabelFontSize = '1rem'
    const labelColor = 'rgb(105 105 105 / 60%)'
    

     // FORM SELECT PROVA
    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    return (
        <div style={{display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent:'center', rowGap:'2.5rem', padding: '4rem 0'}}>
            {/* Procedimento di mediazione */}
            <Grid xs={12}>
            <Grid xs={12}><Typography sx={{fontWeight: '400', fontSize: formLabelFontSize, padding: '0 0 0 1rem', color: '#585858'}}>Procedimento di mediazione</Typography></Grid>
            
            <CssTextField 
            sx={{margin: margin, backgroundColor: backgroundColor, width: inputWidth, minWidth: minWidth, maxWidth: maxWidth, '& .MuiFormLabel-root':{color: labelColor},  '& .MuiOutlinedInput-input':{fontWeight: '600'}}} 
            id="outlined-basic"
            label="Numero" 
            variant="outlined" 
            size='small' 
            required/>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='it' localeText={itIT.components.MuiLocalizationProvider.defaultProps.localeText}>
                <MobileDatePicker 
                label='Data deposito'
                sx={{margin: margin, backgroundColor: backgroundColor, width: inputWidth, minWidth: minWidth, maxWidth: maxWidth, '& .MuiFormLabel-root':{color: labelColor}, '& .MuiOutlinedInput-input':{fontWeight: '600'}}}
                slots={{textField: CssTextField}}
                slotProps={{
                    textField: {
                        InputProps: {
                        endAdornment: (
                            <InputAdornment position="end">
                            <CalendarMonthOutlinedIcon sx={{color: labelColor}}/>
                            </InputAdornment>
                        ),
                        },
                        size: 'small',
                    },
                }}
                />
            </LocalizationProvider>

            <SedeSelect inputWidth={inputWidth} minWidth={minWidth}  maxWidth={maxWidth} margin={margin} backgroundColor={backgroundColor}></SedeSelect>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='it' localeText={itIT.components.MuiLocalizationProvider.defaultProps.localeText}>   
                <MobileDateTimePicker
                label='Data incontro'
                sx={{margin: margin, backgroundColor: backgroundColor, width: inputWidth, minWidth: minWidth, maxWidth: maxWidth, '& .MuiFormLabel-root':{color: labelColor}, '& .MuiOutlinedInput-input':{fontWeight: '600'}}}
                slots={{textField: CssTextField}}
                slotProps={{
                    textField: {
                        InputProps: {
                        endAdornment: (
                            <InputAdornment position="end">
                            <QueryBuilderOutlinedIcon sx={{color: labelColor}}/>
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
                <Grid xs={12}><Typography variant="h6" sx={{fontWeight: '400', fontSize: formLabelFontSize, padding: '0 0 0 1rem',color: '#585858' }}>Controversia</Typography></Grid>

                <FormControl size='small' sx={{width: inputWidth, margin: margin, backgroundColor: backgroundColor, minWidth: minWidth, maxWidth: maxWidth, '& .MuiFormLabel-root':{color: labelColor}} }>
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
                        sx={{'& .MuiOutlinedInput-input':{fontWeight: '600'}}}
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
                        <EuroSymbolIcon sx={{color: labelColor}}/>
                        </InputAdornment>
                    ),
                    }}
                sx={{margin: margin, backgroundColor: backgroundColor, width: inputWidth, minWidth: minWidth, maxWidth: maxWidth, '& .MuiFormLabel-root':{color: labelColor}, '& .MuiOutlinedInput-input':{fontWeight: '600'}}} 
                id="outlined-basic" 
                label="Valore della controversia" 
                variant="outlined" 
                size='small' 
                required/>
            </Grid>
        </div>
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