import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FormLabel from '@mui/material/FormLabel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { itIT } from '@mui/x-date-pickers/locales';
import "dayjs/locale/it";
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as CodiceFiscaleUtils from '/src/assets/js/convalidaCodiceFiscale.js';
import AgenziaEntrateLogo from '/src/assets/img/AgenziaEntrate_logo.png'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import ImportoField from '/src/components/importoField/ImportoField.jsx';


const formLabelFontSize = '1rem'
const labelColor = 'rgb(105 105 105 / 60%)'
const inputSx = {width: '20%', margin: '14px 20px 10px 0px', minWidth: '133.5px', maxWidth: '168px',}


export default function AggiungiParteButton(props) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const theme = useTheme()
    const style = {
        position: 'absolute',
        overflowY: 'scroll',
        minHeight: '600px',
        maxHeight: '600px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '85%',
        height: '90%',
        bgcolor: 'background.default',
        border: 'unset',
        boxShadow: 24,
        p: 4,
    };
    const buttonColor = '#467bae'
    const buttonHoverColor = '#7cb8f2'
      

    return(
        <div style={{display: 'inline-block', ...props.sx}}>
            <Button 
                onClick={handleOpen}
                variant='text'
                sx={{color: buttonColor, '&:hover, &:hover svg':{backgroundColor: 'unset', color: buttonHoverColor}}}
                startIcon={<AddIcon sx={{color: buttonColor, transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'}}/>}
            >
                Crea nuova parte
            </Button>
            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <div style={{borderBottom: '1px solid #f1f1f1', paddingBottom: '16px'}}><Typography id="keep-mounted-modal-title" variant="h5" component="h2">Nuova Anagrafica</Typography></div>
                    <Creazione sx={{margin: '3rem 0 0 0'}}/>
                    <CopilaCampiObbligatoriAlert/>
                </Box>
            </Modal>
        </div>
    )
}

function Creazione(props){
    const theme = useTheme()
    var [tipologiaPersona, setTipologiaPersona] = React.useState('PERSONA_FISICA');

    return (
        <div style={{position: 'relative', display: 'flex', flexDirection:'column', alignItems: 'flex-start', justifyContent:'center', rowGap:'3rem', padding: '0', ...props.sx}}>       
            
            {/* Tipologia */}
            <Grid  xs={12} sx={{width: '100%'}}>
                <Grid xs={12} sx={{borderBottom:'1px solid #467bae61',}}><Typography sx={{fontWeight: '400', fontSize: formLabelFontSize, color: '#467bae'}}>Tipologia</Typography></Grid>
                <FormControl sx={{marginTop: '4px'}}>
                    <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={tipologiaPersona}
                    onChange={(event) => setTipologiaPersona(event.target.value)}
                    >
                    <FormControlLabel 
                    value="PERSONA_FISICA" 
                    control={<Radio />} 
                    label="PERSONA FISICA" 
                    sx={{marginRight: '4.5rem', '& .MuiTypography-root':{color: theme.palette.text.primary, fontWeight: '500'}, '& .MuiRadio-root:not(.Mui-checked) span':{color: labelColor}}}/>
                    
                    <FormControlLabel 
                    value="PERSONA_GIURIDICA" 
                    control={<Radio />} 
                    label="PERSONA GIURIDICA" 
                    sx={{ '& .MuiTypography-root':{color: theme.palette.text.primary, fontWeight: '500', }, '& .MuiRadio-root:not(.Mui-checked) span':{color: labelColor} }}/>
                    
                    </RadioGroup>
                </FormControl>
            </Grid>

            {/* Persona fisica */}
            <Grid xs={12} sx={{width: '100%'}}>
                <Accordion 
                disabled={tipologiaPersona != 'PERSONA_FISICA'}
                expanded={tipologiaPersona == 'PERSONA_FISICA'}
                >
                <AccordionSummary
                    expandIcon={<ArrowDownwardIcon sx={{color: 'white'}}/>}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{backgroundColor: '#467bae', color: 'white', height: '48px', '&.Mui-expanded':{minHeight: 'unset'}}}
                >
                    <Typography>Persona fisica</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{backgroundColor: theme.palette.background.default}}>
                   <FormPersonaFisica/>
                </AccordionDetails>
                </Accordion>
            </Grid>
            
            {/* Persona giuridica */}
            <Grid xs={12} sx={{width: '100%'}}>
                <Accordion 
                disabled={tipologiaPersona != 'PERSONA_GIURIDICA'}
                expanded={tipologiaPersona == 'PERSONA_GIURIDICA'}
                >
                <AccordionSummary
                    expandIcon={<ArrowDownwardIcon sx={{color: 'white'}}/>}
                    aria-controls="panel2-content"
                    id="panel2-header"
                    sx={{backgroundColor: '#467bae', color: 'white', height: '48px', '&.Mui-expanded':{minHeight: 'unset'}}}
                >
                    <Typography>Persona giuridica</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{backgroundColor: theme.palette.background.default}}>
                    <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                    </Typography>
                </AccordionDetails>
                </Accordion>
            </Grid>
            
            {/* Buttons */}
            <Grid xs={12} sx={{width: '100%', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end', marginTop: '3rem', borderTop: '1px solid #f1f1f1'}}>
                <Button 
                    variant='outlined'
                    sx={{
                        width: '90px', 
                        marginRight: '4.5rem', 
                        color:' #467bae', 
                        //'&:hover, &:hover svg':{backgroundColor: 'unset', color: buttonHoverColor},
                        '&.Mui-disabled':{
                            backgroundColor: 'unset', 
                            border: `.9px solid rgb(199 199 199 / 60%)`, 
                            color: theme.palette.text.disabled,
                            fontWeight: '400'
                          }, 
                          backgroundColor: 'unset',
                          border: `.9px solid #467bae`, 
                          '&:hover':{backgroundColor: '#6ea5da29', border: `.9px solid #467bae`}
                    }}
                    startIcon={<ArrowBackOutlinedIcon sx={{color: '#467bae', transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'}}/>}
                >
                    Indietro
                </Button>

                <Button 
                    variant='contained'
                    sx={{width: '90px', color: 'white', backgroundColor: '#108d10', '&:hover, &:hover svg':{backgroundColor: '#119c11', color: 'white'}}}
                    startIcon={<AddIcon sx={{color: 'white', transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'}}/>}
                >
                    Crea
                </Button>
            </Grid>
        </div>
    )
}

function FormPersonaFisica(){
    const theme = useTheme()
    const textFieldSx = {'& .MuiFormLabel-root:not(.Mui-error,.Mui-focused,.Mui-selected)':{color: labelColor}, '& .MuiOutlinedInput-input':{fontWeight: '500', color: theme.palette.text.primary,}, ...inputSx}
    var [captcha, setCaptcha] = React.useState(null) 
    window.AgenziaEntrateAPI.onCaptcha((url) => {console.log(url); setCaptcha(url)})

    return (
        <div style={{position: 'relative', marginTop: '1rem', width: '100%', display: 'flex', flexDirection:'column', alignItems: 'flex-start', justifyContent:'center', rowGap:'2.5rem', padding: '0'}}>
           
            {/* Codice fiscale */}
            <Grid xs={12} sx={{width: '100%'}}>
                <Grid xs={12} sx={{width: '100%', borderBottom:'1px solid #467bae61',}}><Typography sx={{fontWeight: '400', fontSize: formLabelFontSize, color: '#467bae'}}>Codice fiscale</Typography></Grid>

                <CssTextField
                required
                size='small'
                id="outlined-required-cf-piva"
                label="Codice fiscale"
                defaultValue=""
                onChange={(event) => {
                    let cf = event.target.value
                    let isValid = CodiceFiscaleUtils.isValid(cf)
                    console.log(`Codice fiscale valido: ${isValid}`)
                    if(isValid)
                        console.log(`Data di nascita: ${CodiceFiscaleUtils.dataCf(cf)}\nComune:${CodiceFiscaleUtils.comuneCf(cf)}\nSesso:${CodiceFiscaleUtils.sessoCf(cf)}`)
                }}
                sx={textFieldSx}
                />

                <Button 
                    variant='contained'
                    onClick={() => {window.AgenziaEntrateAPI.getCaptcha()}}
                    sx={{
                        width: '110px', 
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
                    startIcon={<Box component="img" sx={{width: '31px', height: '15px'}} src={AgenziaEntrateLogo} width={50} height={32}/>}
                >
                    <div style={{fontFamily: 'Titillium Web',  fontWeight: '600', paddingTop: '2px', paddingLeft: '2px',fontSize: '10px', color: '#00467f'}}>Verifica</div>
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
                    sx={textFieldSx}
                />

                <CssTextField
                    required
                    size='small'
                    id="outlined-required-nome"
                    label="Nome"
                    defaultValue=""
                    sx={textFieldSx}
                />

                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='it' localeText={itIT.components.MuiLocalizationProvider.defaultProps.localeText}>
                    <DatePicker 
                    label='Data di nascita'
                    slots={{textField: CssTextField}}
                    sx={{
                        '& .MuiFormLabel-root:not(.Mui-error)':{color: labelColor}, 
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
                    slotProps={{
                        textField: {
                            //error: dataDepositoError,
                            helperText: "",
                            //required: true,
                            size: 'small',
                            sx: textFieldSx
                        },
                    }}
                    />
                </LocalizationProvider>

                <CssTextField
                    size='small'
                    id="outlined-required-comune-nascita"
                    label="Provincia di nascita"
                    defaultValue=""
                    sx={{...textFieldSx, minWidth: '246px', maxWidth: '250px'}}
                />

                <CssTextField
                    size='small'
                    id="outlined-required-comune-nascita"
                    label="Comune o stato estero di nascita"
                    defaultValue=""
                    sx={{...textFieldSx, minWidth: '246px', maxWidth: '250px'}}
                />

                <FormControl required size='small' sx={{...inputSx, '& .MuiFormLabel-root:not(.Mui-error, .Mui-focused)':{color: labelColor}} }>
                        <InputLabel id="sesso-input-label">Sesso</InputLabel>
                        <CssSelect
                        labelId="sesso-input-label"
                        id="sesso-select"
                        defaultValue={""}
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
                        label="Sesso"
                        size='small'
                        sx={{ width: '90px', '& .MuiOutlinedInput-input':{fontWeight: '500', color: theme.palette.text.primary}, }}
                        >
                        <MenuItem key={`M`} value={'M'}>UOMO</MenuItem>
                        <MenuItem key={`F`} value={'F'}>DONNA</MenuItem>
                        </CssSelect>
                </FormControl>
               
            </Grid>

            {/* Dati demografici */}
            <Grid xs={12} sx={{width: '100%'}}>
                <Grid xs={12} sx={{width: '100%', borderBottom:'1px solid #467bae61',}}><Typography sx={{fontWeight: '400', fontSize: formLabelFontSize, color: '#467bae'}}>Dati demografici</Typography></Grid>

                <CssTextField
                    size='small'
                    id="outlined-required-comune-residenza"
                    label="Comune di residenza"
                    defaultValue=""
                    sx={{...textFieldSx, minWidth: '246px', maxWidth: '250px'}}
                />

                <CssTextField
                    size='small'
                    id="outlined-required-indirizzo"
                    label="Indirizzo"
                    defaultValue=""
                    sx={{...textFieldSx, minWidth: '246px', maxWidth: '250px'}}
                />

                <CssTextField
                    size='small'
                    id="outlined-required-cup"
                    label="CAP"
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
                    defaultValue=""
                    sx={{...textFieldSx, minWidth: '246px', maxWidth: '250px'}}
                />  

            <CssTextField
                    size='small'
                    id="outlined-required-email"
                    label="Email"
                    defaultValue=""
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
                    defaultValue=""
                    sx={textFieldSx}
                />  

                <CssTextField
                    size='small'
                    id="outlined-required-denominazione"
                    label="Denominazione"
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
                    onChange={(event) => event.target.value = event.target.value.trim() == '' ? '' : event.target.value.toLocaleUpperCase()}
                />
            </Grid>


        </div>
    )
}

function CopilaCampiObbligatoriAlert() {
    var [isOpen, setIsOpen] = React.useState(false)

    return (
      <Stack sx={{ width: '100%', zIndex: '99', position: 'sticky', bottom: '0', display: 'flex', alignItems: 'center'}} spacing={2}>
        { isOpen && <Alert open onClose={() => {setIsOpen(false)}} severity="warning" sx={{width: '60%', '& .MuiAlert-message':{display: 'flex', justifyItems: 'center', alignItems: 'center'}}}>
          Per procedere all verifica compila i campi 'Nome', 'Cognome', 'Codice fiscale'
        </Alert> }
      </Stack>
    );
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

const CssSelect = styled(Select)(({ theme }) => ({

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
