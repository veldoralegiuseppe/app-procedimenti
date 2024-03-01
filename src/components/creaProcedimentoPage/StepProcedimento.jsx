import * as React from 'react';
import { Typography } from '@mui/material';
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
import dayjs from 'dayjs';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import InputAdornment from '@mui/material/InputAdornment';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';
import { CssTextField, CssSelect} from './DefinisciProcedimentoTheming.jsx';
import { useTheme } from '@mui/material/styles';
import RegistroProcedimentoButton from './RegistroProcedimentoButton.jsx';
import {ProcedimentoContext} from '/src/store/procedimento-context.jsx'


/**
 * Pagina associata allo step 'Definisci procedimento'
 * @returns Step procedimento
 */
export default function StepProcedimento(){
    const theme = useTheme()
    const {procedimento} = React.useContext(ProcedimentoContext)
    const inputWidth = '20%'
    const minWidth = '133.5px'
    const maxWidth = '200px'
    const margin = '18px 20px 10px 10px'
    const backgroundColor = theme.palette.background.default
    const formLabelFontSize = '1rem'
    const labelColor = 'rgb(105 105 105 / 60%)'
    const oggettiControversia = [{value: 'ALTRE NATURE DELLA CONTROVERSIA', view: 'ALTRE NATURE DELLA CONTROVERSIA'}, {value:'CONTRATTI BANCARI', view: 'CONTRATTI BANCARI'}, {value:'CONTRATTI FINANZIARI', view:'CONTRATTI FINANZIARI'}, {value: 'CONTRATTI DI OPERA', view: 'CONTRATTI D\'OPERA'}, {value:'CONTRATTI DI RETE', view: 'CONTRATTI DI RETE'}, {value:'CONTRATTI DI SOMMINISTRAZIONE', view:'CONTRATTI DI SOMMINISTRAZIONE'}, {value:'CONSORZIO', view:'CONSORZIO'}, {value:'DIRITTI REALI', view:'DIRITTI REALI'}, {value:'DIVISIONE', view:'DIVISIONE'}, {value:'FRANCHISING', view:'FRANCHISING'}, {value: 'LOCAZIONE', view: 'LOCAZIONE'}, {value:'PATTI DI FAMIGLIA', view:'PATTI DI FAMIGLIA'}, {value: 'RESPONSABILITA MEDICA', view: 'RESPONSABILITÀ MEDICA'}, {value:'RISARCIMENTO DANNI MEZZO STAMPA', view:'RISARCIMENTO DANNI MEZZO STAMPA'}, {value:'SUCCESSIONE EREDITARIA', view:'SUCCESSIONE EREDITARIA'}, {value: 'SOCIETA DI PERSONE', view:'SOCIETÀ DI PERSONE'}, {value: 'SUBFORNITURA', view: 'SUBFORNITURA'}]
    const valoreControversiaRef = React.useRef(null);
    const oggControvMenuItemStyle = {'&:hover':{backgroundColor: theme.palette.dropdown.hover}, '&.Mui-selected, &.Mui-selected:hover':{backgroundColor: theme.palette.dropdown.selected, color: 'white'}}

    /**
     * Gestisce il click al di fuori del componente di interesse
     * @param {*} ref 
     */
    function handleClickOutside(ref){
        React.useEffect(() => {
            /**
             * Alert if clicked on outside of element
             */
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    let importo = ref.current.childNodes[1].childNodes[1].value

                    if (convalidaCifra(importo)){
                        if(!importo.includes(',')) importo += ',00'
                        ref.current.childNodes[1].childNodes[1].setAttribute('value',importo)
                        ref.current.childNodes[1].childNodes[1].value = importo
                        procedimento.valoreControversia = importo
                    }
                   
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
     * Convalida la cifra espressa in euro 
     * @param {String} ref Riferimento al componente
     */
    function convalidaCifra(importo){
        var regex = /^\d+(\,\d{1,2})?$/
        return regex.test(importo)
    }
    handleClickOutside(valoreControversiaRef)

    return (
        <div style={{display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent:'center', rowGap:'4rem', padding: '4rem 0'}}>
            {/* Procedimento di mediazione */}
            <Grid xs={12}>
                <Grid xs={12} sx={{borderBottom:'1px solid #467bae61', margin: '0 0 0 1rem', width: 'calc(100% - 1rem)'}}><Typography sx={{fontWeight: '400', fontSize: formLabelFontSize, color: '#467bae'}}>Procedimento di mediazione</Typography></Grid>
                
                <RegistroProcedimentoButton 
                onChange={(numProtocollo, anno) => {
                    procedimento.numProtocollo = numProtocollo
                    procedimento.annoProtocollo = anno
                }}
                numProtocollo={procedimento.numProtocollo}
                anno={procedimento.annoProtocollo}
                >
                </RegistroProcedimentoButton>

                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='it' localeText={itIT.components.MuiLocalizationProvider.defaultProps.localeText}>
                    <MobileDatePicker 
                    label='Data deposito'
                    value={dayjs(procedimento.dataDeposito)}
                    onChange={ (value) => {
                        procedimento.dataDeposito = new Date(value)
                        procedimento.dataDepositoLocale = new Date(value).toLocaleDateString('it-IT')
                    }}
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

                <SedeSelect  
                onChange={(values) => {
                    if(!values) procedimento.sede = undefined
                    else procedimento.sede = values.sede
                }} 
                currValue={procedimento.sede ? procedimento.sede : null}
                inputWidth={inputWidth} 
                minWidth={minWidth}  
                maxWidth={maxWidth} 
                margin={margin} 
                labelColor={labelColor}
                backgroundColor={backgroundColor}
                />

                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='it' localeText={itIT.components.MuiLocalizationProvider.defaultProps.localeText}>   
                    <MobileDateTimePicker
                    label='Data incontro'
                    value={procedimento.dataOraIncontro ? dayjs(procedimento.dataOraIncontro) : undefined}
                    onChange={ (value) => {
                        let dataIncontro = new Date(value).toLocaleDateString('it-IT')
                        let oraIncontro = new Date(value).toLocaleTimeString('it-IT')
                        procedimento.dataOraIncontro = new Date(value)
                        procedimento.dataIncontro = dataIncontro
                        procedimento.oraIncontro = oraIncontro
                    }}
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
                <Grid xs={12} sx={{borderBottom:'1px solid #467bae61', margin: '0 0 0 1rem', width: 'calc(100% - 1rem)'}}><Typography variant="h6" sx={{fontWeight: '400', fontSize: formLabelFontSize, color: `#467bae` }}>Controversia</Typography></Grid>

                <FormControl size='small' sx={{width: inputWidth, margin: margin, backgroundColor: backgroundColor, minWidth: minWidth, maxWidth: maxWidth, '& .MuiFormLabel-root':{color: labelColor}} }>
                        <InputLabel id="oggetto-controversia-input-label">Oggetto</InputLabel>
                        <CssSelect
                        labelId="oggetto-controversia-input-label"
                        id="oggetto-controversia-select"
                        defaultValue={procedimento.oggettoControversia ? procedimento.oggettoControversia : ""}
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
                                        maxHeight: '125px',
                                        overflowY: 'scroll'
                                    },
                                },
                            },
                        }}
                        label="Oggetto"
                        size='small'
                        onChange={(event) => {
                            procedimento.oggettoControversia = event.target.value
                        }}
                        sx={{'& .MuiOutlinedInput-input':{fontWeight: '500', color: theme.palette.text.primary}, }}
                        >
                        {
                            oggettiControversia.map((ogg, index) => (
                                <MenuItem sx={oggControvMenuItemStyle} key={`oggetto-controversia-item-${index}`} value={ogg.value}>{ogg.view}</MenuItem>
                            ))
                        }
                        </CssSelect>
                </FormControl>

                <CssTextField 
                InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                    <EuroSymbolIcon sx={{color: '#69696961'}}/>
                    </InputAdornment>
                ),
                }}
                defaultValue={procedimento.valoreControversia}
                onChange={event => {
                    let importoCorrente = event.currentTarget.value
                    var regex = /^\d+(\,\d{0,2})?$/g

                    if( regex.test(importoCorrente) ) 
                        procedimento.valoreControversia = event.currentTarget.value
                    else 
                        event.currentTarget.value = importoCorrente.substr(0, importoCorrente.length - 1)
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
