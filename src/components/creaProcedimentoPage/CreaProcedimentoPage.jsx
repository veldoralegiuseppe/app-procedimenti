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
import RegistroProcedimentoButton from './RegistroProcedimentoButton.jsx';


export default function CreaProcedimento(){

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
    const valoreControversiaRef = React.useRef(null);
    const oggControvMenuItemStyle = {'&:hover':{backgroundColor: theme.palette.dropdown.hover}, '&.Mui-selected, &.Mui-selected:hover':{backgroundColor: theme.palette.dropdown.selected, color: 'white'}}

    handleClickOutside(valoreControversiaRef, convalidaCifra)

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
                
                <RegistroProcedimentoButton onChange={(value) => {console.log(`Valore giunto al parent: ${value}`)} }></RegistroProcedimentoButton>

                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='it' localeText={itIT.components.MuiLocalizationProvider.defaultProps.localeText}>
                    <MobileDatePicker 
                    label='Data deposito'
                    sx={{
                        margin: margin, 
                        backgroundColor: backgroundColor, 
                        width: inputWidth, 
                        minWidth: minWidth, 
                        maxWidth: maxWidth, 
                        '& .MuiFormLabel-root':{color: labelColor}, 
                        '& .MuiOutlinedInput-input':{fontWeight: '500'},
                        '& .MuiDayCalendar-weekDayLabel': {
                            color: 'red !important',
                            borderRadius: 2,
                            borderWidth: 1,
                            borderColor: '#e91e63',
                            border: '1px solid',
                            backgroundColor: '#f8bbd0',
                        },
                    }}
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
                    sx={{margin: margin, backgroundColor: backgroundColor, width: inputWidth, minWidth: minWidth, maxWidth: maxWidth, '& .MuiFormLabel-root':{color: labelColor}, '& .MuiOutlinedInput-input':{fontWeight: '500'}}}
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

                <FormControl size='small' sx={{width: inputWidth, margin: margin, backgroundColor: backgroundColor, minWidth: minWidth, maxWidth: maxWidth,} }>
                        <InputLabel id="oggetto-controversia-input-label">Oggetto</InputLabel>
                        <CssSelect
                        labelId="oggetto-controversia-input-label"
                        id="oggetto-controversia-select"
                        value={age}
                        inputProps={{
                            MenuProps: {
                                MenuListProps: {
                                    sx: {
                                        backgroundColor: theme.palette.dropdown.primary,
                                        color: theme.palette.primary.main,
                                    }
                                },
                                PaperProps: {
                                    sx: {
                                    '& .MuiMenuItem-root': {
                                        //padding: '1rem',
                                        fontSize: '.9rem',
                                        fontWeight: '400',
                                    },
                                    },
                                },
                            },
                        }}
                        label="Oggetto"
                        size='small'
                        onChange={handleChange}
                        sx={{'& .MuiOutlinedInput-input':{fontWeight: '500'},}}
                        >
                        <MenuItem sx={oggControvMenuItemStyle} value={10}>Ten</MenuItem>
                        <MenuItem sx={oggControvMenuItemStyle} value={20}>Twenty</MenuItem>
                        <MenuItem sx={oggControvMenuItemStyle} value={30}>Thirty</MenuItem>
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
                sx={{margin: margin, backgroundColor: backgroundColor, width: inputWidth, minWidth: minWidth, maxWidth: maxWidth, '& .MuiFormLabel-root':{color: labelColor}, '& .MuiOutlinedInput-input':{fontWeight: '500'}}} 
                id="outlined-basic" 
                label="Valore della controversia" 
                ref={valoreControversiaRef}
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

/**
 * Gestisce il click al di fuori del componente di interesse
 * @param {*} ref 
 */
function handleClickOutside(ref, callback){
    React.useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                if(callback) callback(ref)
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

/**
 * Convalida la cifra espressa in euro aggiungendo all'occorrenza la virgola
 * @param {String} ref Riferimento al componente
 */
function convalidaCifra(ref){
    let importo = ref.current.childNodes[1].childNodes[1].value
    if(!importo) return

    var regex = /^\d+(\,\d{1,2})?$/
    if(!regex.test(importo)) console.log('Errore')
    else if(!importo.includes(',')){
        importo += ',00'
        ref.current.childNodes[1].childNodes[1].value = importo
    }
}