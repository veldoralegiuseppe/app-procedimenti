import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { FormHelperText } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { itIT } from '@mui/x-date-pickers/locales';
import "dayjs/locale/it";
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as CodiceFiscaleUtils from '/src/assets/js/convalidaCodiceFiscale.js';
import AgenziaEntrateLogo from '/src/assets/img/AgenziaEntrate_logo.png'
import ImportoField from '/src/components/importoField/ImportoField.jsx';
import { PersonaFisica } from '/src/vo/personaFisica.js';
import Select from '@mui/material/Select';
import ProvinciaSelect from '/src/components/provinciaSelect/ProvinciaSelect.jsx';
import ComuneSelect from '/src/components/comuneSelect/ComuneSelect.jsx';
import * as ComuniUtils from '/src/assets/js/comuni.js'

const labelColor = 'rgb(105 105 105 / 60%)'
const labelDisableColor = 'rgb(148 148 148 / 60%)'
const inputSx = {width: '20%', margin: '14px 20px 10px 0px', minWidth: '133.5px', maxWidth: '168px',}
const formLabelFontSize = '1rem'
const anagraficaHelperText = ""

function FormPersonaFisica(props, ref){
    const theme = useTheme()
    const textFieldSx = {'& .MuiFormLabel-root:not(.Mui-error,.Mui-focused,.Mui-selected)':{color: labelColor}, '& .MuiFormLabel-root.Mui-disabled':{color: labelDisableColor},'& .MuiOutlinedInput-input':{fontWeight: '500', color: theme.palette.text.primary,}, ...inputSx}
    var [captcha, setCaptcha] = React.useState(null) 
    var [parteAttuale, setParteAttuale] = React.useState(new PersonaFisica())
    var comuneNascitaRef = React.useRef()
    var provinciaNascitaRef = React.useRef()
    var [erroreCf, setErroreCf] = React.useState(false)
    var [helperTextCf, setHelperTextCf] = React.useState("")
   
    
    React.useImperativeHandle(ref, () => ({
            onSubmit(){
                return parteAttuale
            }
        }),
    )

    React.useEffect(() => {
        // Inizializzo l'API dei comuni
        ComuniUtils.initialize()

        // API Electron
        window.AgenziaEntrateAPI.onCaptcha((url) => {console.log(url); setCaptcha(url)})
    },[])

    return (
        <div style={{position: 'relative', marginTop: '1rem', width: '100%', display: 'flex', flexDirection:'column', alignItems: 'flex-start', justifyContent:'center', rowGap:'2.5rem', padding: '0'}}>
           
            {/* Codice fiscale */}
            <Grid xs={12} sx={{width: '100%'}}>
                <Grid xs={12} sx={{width: '100%', borderBottom:'1px solid #467bae61',}}><Typography sx={{fontWeight: '400', fontSize: formLabelFontSize, color: '#467bae'}}>Codice fiscale</Typography></Grid>

                <CssTextField
                required
                error={erroreCf}
                helperText={helperTextCf}
                size='small'
                id="outlined-required-cf-piva"
                label="Codice fiscale"
                defaultValue=""
                onChange={(event) => {
                    // Verifica dell'input
                    let cf = event.currentTarget.value.toLocaleUpperCase()
                    let regex = /^[a-zA-Z0-9]{0,16}$/g
                    if(!regex.test(cf)){
                        event.target.value = cf.slice(0, cf.length-1)
                        return
                    }
                   
                    // Controllo se il codice fiscale inserito sia valido
                    let isValid = false 
                    if(cf.length == 16) isValid = CodiceFiscaleUtils.isValid(cf)
                
                    // Aggiornamento automatico della view
                    if(cf.length == 16 && isValid){
                       
                        let comuneNascita = CodiceFiscaleUtils.comuneCf(cf)

                        // Rimuovo gli errori se presenti
                        if(erroreCf){
                            setErroreCf(false)
                            setHelperTextCf("")
                        }

                        // Aggiorno la parte attuale
                        parteAttuale.codiceFiscale = cf
                        parteAttuale.dataNascita = CodiceFiscaleUtils.dataCf(cf)
                        parteAttuale.comuneNascita = comuneNascita
                        parteAttuale.provinciaNascita = comuneNascita.provincia
                        parteAttuale.sesso = CodiceFiscaleUtils.sessoCf(cf)
                        setParteAttuale({...parteAttuale})

                        // Aggiorno il valore dei dati anagrafici
                        provinciaNascitaRef.current.setProvincia(parteAttuale.provinciaNascita)
                        comuneNascitaRef.current.setComune(comuneNascita)

                    } else if(cf.length == 16 && !isValid){
                        console.log('Gestiore errore formato codice fiscale')
                        // Abilito l'errore ed il messaggio
                        setErroreCf(true)
                        setHelperTextCf('Codice fiscale non valido')
                        
                        // Ripristino i campi calcolati
                        parteAttuale.codiceFiscale = null
                        parteAttuale.dataNascita = null
                        parteAttuale.comuneNascita = null
                        parteAttuale.provinciaNascita = null
                        parteAttuale.sesso = null
                        setParteAttuale({...parteAttuale})

                        provinciaNascitaRef.current.setProvincia(null)
                        comuneNascitaRef.current.setComune(null) 
                    } else if(parteAttuale.codiceFiscale) {
                        // Rimuovo gli errori se presenti
                        if(erroreCf){
                            setErroreCf(false)
                            setHelperTextCf("")
                        }

                        // Ripristino i campi calcolati in precedenza la parte attuale
                        console.log('Ripristino i campi anagrafici')
                        parteAttuale.codiceFiscale = null
                        parteAttuale.dataNascita = null
                        parteAttuale.comuneNascita = null
                        parteAttuale.provinciaNascita = null
                        parteAttuale.sesso = null
                        setParteAttuale({...parteAttuale})

                        provinciaNascitaRef.current.setProvincia(null)
                        comuneNascitaRef.current.setComune(null)
                    }
                    
                }}
                sx={textFieldSx}
                />

            
                <Button 
                    id='button-agenzia-entrate'
                    variant='contained'
                    onClick={() => {window.AgenziaEntrateAPI.getCaptcha()}}
                    sx={{
                        width: '176px', 
                        height: '34.13px',
                        margin: '14px 20px 10px 10px',
                        //'&:hover, &:hover svg':{backgroundColor: 'unset', color: buttonHoverColor},
                        '&.Mui-disabled':{
                            backgroundColor: 'unset', 
                            border: `.9px solid rgb(199 199 199 / 60%)`, 
                            color: theme.palette.text.disabled,
                            fontWeight: '400'
                        }, 
                        backgroundColor: '#f0f0f05c',
                        '&:hover':{backgroundColor: '#6ea5da29'}
                    }}
                    startIcon={<Box component="img" sx={{width: '33px', height: '13px'}} src={AgenziaEntrateLogo} width={50} height={32}/>}
                >
                    <div style={{fontFamily: 'Titillium Web',  fontWeight: '600', paddingTop: '2px', paddingLeft: '2px',fontSize: '10px', color: '#00467f'}}>Verifica anagrafica</div>
                </Button>
               
               
                
                {/* {captcha 
                ? <Box
                    component="img"
                    sx={{
                    height: 75,
                    width: 150,
                    }}
                    alt="The house from the offer."
                    src={captcha}
                   /> 
                : <></>} */}
            </Grid>

            {/* Dati anagrafici */}
            <Grid xs={12} sx={{width: '100%'}}>
                <Grid xs={12} sx={{width: '100%', borderBottom:'1px solid #467bae61',}}><Typography sx={{fontWeight: '400', fontSize: formLabelFontSize, color: '#467bae'}}>Dati anagrafici</Typography></Grid>

                <CssTextField
                    required
                    size='small'
                    id="outlined-required-cognome"
                    label="Cognome"
                    defaultValue=""
                    onChange={(event) => {
                         // Verifica dell'input
                        let text = event.currentTarget.value.toLocaleUpperCase()
                        let regex = /^[a-zA-Z]*$/g
                        if(!regex.test(text)){
                            event.target.value = text.slice(0, text.length-1)
                            return
                        }
                        parteAttuale.cognome = text
                        setParteAttuale({...parteAttuale})
                    }}
                    sx={textFieldSx}
                />

                <CssTextField
                    required
                    size='small'
                    id="outlined-required-nome"
                    label="Nome"
                    onChange={(event) => {
                        // Verifica dell'input
                        let text = event.currentTarget.value.toLocaleUpperCase()
                        let regex = /^[a-zA-Z]*$/g
                        if(!regex.test(text)){
                            event.target.value = text.slice(0, text.length-1)
                            return
                        }
                        parteAttuale.nome = text
                        setParteAttuale({...parteAttuale})
                    }}
                    defaultValue=""
                    sx={textFieldSx}
                />

                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='it' localeText={itIT.components.MuiLocalizationProvider.defaultProps.localeText}>
                    <DatePicker 
                    disabled={true}
                    label='Data di nascita'
                    slots={{textField: CssTextField}}
                    value={parteAttuale.dataNascita ? dayjs(parteAttuale.dataNascita) : null}
                    sx={{
                        '& .MuiFormLabel-root:not(.Mui-error, .Mui-focused, .Mui-disabled)':{color: labelColor}, 
                        '& .MuiFormLabel-root.Mui-disabled':{color: labelDisableColor},
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
                    onChange={ (value) => {
                        parteAttuale.dataNascita = new Date(value)
                        parteAttuale.dataNascitaLocale = new Date(value).toLocaleDateString('it-IT')
                        setParteAttuale({...parteAttuale})
                    }}
                    slotProps={{
                        textField: {
                            //error: dataDepositoError,
                            helperText: anagraficaHelperText,
                            //required: true,
                            size: 'small',
                            disabled: 'false',
                            sx: textFieldSx
                        },
                    }}
                    />
                </LocalizationProvider>

                <FormControl size='small' disabled={true} sx={{...inputSx, '& .MuiFormLabel-root:not(.Mui-error, .Mui-focused, .Mui-disabled)':{color: labelColor},  '&.Mui-disabled .MuiFormLabel-root':{color: labelDisableColor}, }}>
                        <InputLabel sx={{'&.Mui-disabled':{color: labelDisableColor}}} id="sesso-input-label">Sesso</InputLabel>
                        <CssSelect
                        disabled={true}
                        labelId="sesso-input-label"
                        id="sesso-select"
                        value={parteAttuale.sesso ? parteAttuale.sesso : ""}
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
                                    },
                                },
                            },
                        }}
                        onChange={(event) => {
                            parteAttuale.sesso = event.target.value
                            setParteAttuale({...parteAttuale})
                        }}
                        size='small'
                        label='Sesso'
                        sx={{'& .MuiOutlinedInput-input':{fontWeight: '500', color: theme.palette.text.primary}, }}
                        >
                        <MenuItem key={`M`} value={'M'}>UOMO</MenuItem>
                        <MenuItem key={`F`} value={'F'}>DONNA</MenuItem>
                        </CssSelect>
                        <FormHelperText sx={{color: 'rgba(0, 0, 0, 0.38)'}}>{anagraficaHelperText}</FormHelperText>
                </FormControl>

                <Grid xs={12}>
                    <ProvinciaSelect 
                    ref={provinciaNascitaRef}
                    sx={{...inputSx, width: '260px', maxWidth: 'unset'}} 
                    label="Provincia di nascita"
                    disabled={true}
                    helperText={anagraficaHelperText}
                    onChange={(value) => {
                        parteAttuale.provinciaNascita = value
                        console.log(`Provincia selezionata: ${value}`)
                        comuneNascitaRef.current.setProvincia(value)
                        setParteAttuale({...parteAttuale})
                    }}
                    />

                    <ComuneSelect
                        sx={{...inputSx, width: '260px', maxWidth: 'unset',}} 
                        provincia={parteAttuale.provinciaNascita}
                        disabled={true}
                        helperText={anagraficaHelperText}
                        label="Comune o stato estero di nascita"
                        ref={comuneNascitaRef}
                    />
                </Grid>
               

            </Grid>

            {/* Dati demografici */}
            <Grid xs={12} sx={{width: '100%'}}>
                <Grid xs={12} sx={{width: '100%', borderBottom:'1px solid #467bae61',}}><Typography sx={{fontWeight: '400', fontSize: formLabelFontSize, color: '#467bae'}}>Dati demografici</Typography></Grid>

                <CssTextField
                    size='small'
                    id="outlined-required-comune-residenza"
                    label="Comune di residenza"
                    defaultValue=""
                    onChange={(event) => {
                        parteAttuale.comuneResidenza = event.currentTarget.value.toLocaleUpperCase()
                        setParteAttuale({...parteAttuale})
                    }}
                    sx={{...textFieldSx, minWidth: '246px', maxWidth: '250px'}}
                />

                <CssTextField
                    size='small'
                    id="outlined-required-indirizzo"
                    label="Indirizzo"
                    onChange={(event) => {
                        parteAttuale.indirizzo = event.currentTarget.value.toLocaleUpperCase()
                        setParteAttuale({...parteAttuale})
                    }}
                    defaultValue=""
                    sx={{...textFieldSx, minWidth: '246px', maxWidth: '250px'}}
                />

                <CssTextField
                    size='small'
                    id="outlined-required-cup"
                    label="CAP"
                    onChange={(event) => {
                        parteAttuale.cap = event.currentTarget.value.toLocaleUpperCase()
                        setParteAttuale({...parteAttuale})
                    }}
                    defaultValue=""
                    sx={textFieldSx}
                />      
            </Grid>

            {/* Recapiti */}
            <Grid xs={12} sx={{width: '100%'}}>
                <Grid xs={12} sx={{width: '100%', borderBottom:'1px solid #467bae61',}}><Typography sx={{fontWeight: '400', fontSize: formLabelFontSize, color: '#467bae'}}>Recapiti</Typography></Grid>

                <CssTextField
                    size='small'
                    id="outlined-required-pec"
                    label="PEC"
                    onChange={(event) => {
                        parteAttuale.pec = event.currentTarget.value.toLocaleUpperCase()
                        setParteAttuale({...parteAttuale})
                    }}
                    defaultValue=""
                    sx={{...textFieldSx, minWidth: '246px', maxWidth: '250px'}}
                />  

                <CssTextField
                        size='small'
                        id="outlined-required-email"
                        label="Email"
                        defaultValue=""
                        onChange={(event) => {
                            parteAttuale.email = event.currentTarget.value.toLocaleUpperCase()
                            setParteAttuale({...parteAttuale})
                        }}
                        sx={{...textFieldSx, minWidth: '246px', maxWidth: '250px'}}
                    />  
                </Grid>

            {/* Ditta individule */}
            <Grid xs={12} sx={{width: '100%'}}>
                <Grid xs={12} sx={{width: '100%', borderBottom:'1px solid #467bae61',}}><Typography sx={{fontWeight: '400', fontSize: formLabelFontSize, color: '#467bae'}}>Ditta individuale</Typography></Grid>
                
                <CssTextField
                    size='small'
                    id="outlined-required-piva"
                    label="Partita IVA"
                    onChange={(event) => {
                        parteAttuale.partitaIVA = event.currentTarget.value.toLocaleUpperCase()
                        setParteAttuale({...parteAttuale})
                    }}
                    defaultValue=""
                    sx={textFieldSx}
                />  

                <CssTextField
                    size='small'
                    id="outlined-required-denominazione"
                    label="Denominazione"
                    onChange={(event) => {
                        parteAttuale.denominazione = event.currentTarget.value.toLocaleUpperCase()
                        setParteAttuale({...parteAttuale})
                    }}
                    defaultValue=""
                    sx={{...textFieldSx, minWidth: '400px', maxWidth: '420px'}}
                />  

            </Grid>

             {/* Assistenza legale */}
            <Grid xs={12} sx={{width: '100%'}}>
            <Grid xs={12} sx={{borderBottom:'1px solid #467bae61',}}><Typography sx={{fontWeight: '400', fontSize: formLabelFontSize, color: '#467bae'}}>Assistenza legale</Typography></Grid>
                <CssTextField
                    required
                    size='small'
                    id="outlined-required-avvocato"
                    label="Avvocato"
                    onChange={(event) => {
                        parteAttuale.assistenzaLegale = event.currentTarget.value.toLocaleUpperCase()
                        setParteAttuale({...parteAttuale})
                    }}
                    defaultValue=""
                    sx={{...textFieldSx, minWidth: '246px', maxWidth: '250px'}}
                />
            </Grid>

            {/* Spese di mediazione */}
            <Grid xs={12} sx={{width: '100%'}}>
                <Grid xs={12} sx={{borderBottom:'1px solid #467bae61',}}><Typography sx={{fontWeight: '400', fontSize: formLabelFontSize, color: '#467bae'}}>Spese di mediazione</Typography></Grid>
                <ImportoField importo={'0,00'} sx={inputSx} label={"Spese di avvio"} required={true}></ImportoField>
                <ImportoField importo={'0,00'} sx={inputSx} label={"Spese postali"} required={true}></ImportoField>
                <ImportoField importo={'0,00'} sx={inputSx} label={"Pagamento indennità"} required={true}></ImportoField>
            </Grid>

            {/* Note */}
            <Grid xs={12} sx={{width: '100%'}}>
                <Grid xs={12} sx={{borderBottom:'1px solid #467bae61',}}><Typography sx={{fontWeight: '400', fontSize: formLabelFontSize, color: '#467bae'}}>Informazioni aggiuntive</Typography></Grid>
                <CssTextField
                    id="outlined-required-note"
                    label="Note"
                    multiline
                    rows={3}
                    sx={{...textFieldSx, minWidth: '100%'}}
                    onChange={(event) => {
                        event.target.value = event.target.value.trim() == '' ? '' : event.target.value.toLocaleUpperCase()
                        parteAttuale.note = event.target.value
                        setParteAttuale({...parteAttuale})
                    }}
                />
            </Grid>

        </div>
    )
}

const CssTextField = styled(TextField)(({ theme }) => ({

    //  '& .MuiInputLabel-root[data-shrink="true"]':{
    //     color: theme.palette.logo.secondary,
  
    //     '& ~ .MuiInputBase-root fieldset':{ borderColor: theme.palette.logo.secondary,}
    //   },
      '& .MuiInputLabel-root.Mui-focused:not(.Mui-error), & .MuiFormLabel-root.Mui-focused:not(.Mui-error)':{ color: theme.palette.logo.secondary,},
      '& .MuiOutlinedInput-root': {
          'input':{textTransform: 'uppercase'},
          '&.Mui-disabled':{backgroundColor: '#efefef73'},
          '&.Mui-disabled fieldset':{borderColor: '#eaeaea'},
          '&:hover:not(.Mui-disabled, .Mui-error) fieldset': {
              borderColor: theme.palette.logo.secondary,
          },
          '&.Mui-focused.Mui-error fieldset': {
            borderWidth: '1.2px'
          },
          '&.Mui-focused:not(.Mui-error) fieldset': {
              border: `1.2px solid ${theme.palette.logo.secondary}`,
          },
          '&.Mui-focused:not(.Mui-error) .MuiInputAdornment-root .MuiSvgIcon-root': {
              fill: `${theme.palette.logo.secondary} !important`,
          },
      },
}));

const CssSelect = styled(Select)(({ theme }) => ({
    '&.Mui-disabled':{backgroundColor: '#efefef73'},
    '&.Mui-disabled fieldset':{borderColor: '#eaeaea !important'},
    '&:hover:not(.Mui-disabled) .MuiOutlinedInput-notchedOutline': {
      borderColor: `${theme.palette.logo.secondary}`,
    },
    '&:hover:not(.Mui-disabled) .MuiSvgIcon-root, &.Mui-focused .MuiSvgIcon-root': {
      fill: `${theme.palette.logo.secondary} !important`,
    },
    '& .MuiInputLabel-root.Mui-focused':{ color: `${theme.palette.logo.secondary} !important`,},
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: `1.2px solid ${theme.palette.logo.secondary}`,
  },
}));

export default React.forwardRef(FormPersonaFisica)