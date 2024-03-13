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
                    <Typography id="keep-mounted-modal-title" variant="h5" component="h2">Nuova Anagrafica</Typography>
                    <Creazione sx={{margin: '3rem 0 0 0'}}/>
                </Box>
            </Modal>
        </div>
    )
}

function Creazione(props){
    const theme = useTheme()
    const backgroundColor = theme.palette.background.default
    var [tipologiaPersona, setTipologiaPersona] = React.useState('PERSONA_FISICA');
    const textFieldSx = {'& .MuiFormLabel-root:not(.Mui-error)':{color: labelColor}, '& .MuiOutlinedInput-input':{fontWeight: '500', color: theme.palette.text.primary,}, ...inputSx}
    const buttonColor = '#82b9ec'
    const buttonHoverColor = '#4a769b'

   

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
            

            {/* Dati del soggetto */}
            {/* <Grid xs={12} sx={{width: '100%'}}>
                <Grid xs={12} sx={{borderBottom:'1px solid #467bae61',}}><Typography sx={{fontWeight: '400', fontSize: formLabelFontSize, color: '#467bae'}}>Dati del soggetto</Typography></Grid>
                
                <CssTextField
                    required
                    size='small'
                    id="outlined-required-cf-piva"
                    label="Codice fiscale/P.IVA"
                    defaultValue=""
                    sx={textFieldSx}
                />

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

                <CssTextField
                    type='email'
                    size='small'
                    id="outlined-required-email"
                    label="Email"
                    defaultValue=""
                    sx={textFieldSx}
                />
            </Grid> */}

            {/* Domicilio */}
            {/* <Grid xs={12} sx={{width: '100%'}}>
            <Grid xs={12} sx={{borderBottom:'1px solid #467bae61',}}><Typography sx={{fontWeight: '400', fontSize: formLabelFontSize, color: '#467bae'}}>Domicilio</Typography></Grid>

                <CssTextField
                    sx={textFieldSx}
                    size='small'
                    id="outlined-required-indirizzo"
                    label="Indirizzo"
                    defaultValue=""
                />

                <CssTextField
                    sx={textFieldSx}
                    size='small'
                    id="outlined-required-citta"
                    label="Città"
                    defaultValue=""
                />

                <CssTextField
                    sx={textFieldSx}
                    size='small'
                    id="outlined-required-cap"
                    label="CAP"
                    defaultValue=""
                />
            </Grid> */}

            {/* Assistenza legale */}
            {/* <Grid xs={12} sx={{width: '100%'}}>
            <Grid xs={12} sx={{borderBottom:'1px solid #467bae61',}}><Typography sx={{fontWeight: '400', fontSize: formLabelFontSize, color: '#467bae'}}>Assistenza legale</Typography></Grid>
                <CssTextField
                    required
                    size='small'
                    id="outlined-required-avvocato"
                    label="Avvocato"
                    defaultValue=""
                    sx={textFieldSx}
                />
            </Grid> */}

            {/* Buttons */}
            {/* <Grid xs={12} sx={{width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '3rem'}}>
                <Button 
                    variant='outlined'
                    sx={{
                        width: '90px', 
                        marginRight: '3rem', 
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
            </Grid> */}
        </div>
    )
}

function FormPersonaFisica(){
    const theme = useTheme()
    const textFieldSx = {'& .MuiFormLabel-root:not(.Mui-error,.Mui-focused,.Mui-selected)':{color: labelColor}, '& .MuiOutlinedInput-input':{fontWeight: '500', color: theme.palette.text.primary,}, ...inputSx}
   
    return (
        <div style={{position: 'relative', marginTop: '1rem', width: '100%', display: 'flex', flexDirection:'column', alignItems: 'flex-start', justifyContent:'center', rowGap:'2.5rem', padding: '0'}}>
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

                <CssTextField
                required
                size='small'
                id="outlined-required-cf-piva"
                label="Codice fiscale"
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
                    label="Comune di nascita"
                    defaultValue=""
                    sx={{...textFieldSx, minWidth: '246px', maxWidth: '250px'}}
                />
               
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
        </div>
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
