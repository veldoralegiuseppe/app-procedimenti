import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Unstable_Grid2';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { PersonaFisica } from '/src/vo/personaFisica.js';
import FormPersonaFisica from '/src/components/formPersonaFisica/FormPersonaFisica.jsx';

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
                    <CompilaCampiObbligatoriAlert/>
                </Box>
            </Modal>
        </div>
    )
}

function Creazione(props){
    const theme = useTheme()
    var [tipologiaPersona, setTipologiaPersona] = React.useState('PERSONA_FISICA')
    const formPersonaFisicaRef = React.useRef()

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
                   <FormPersonaFisica ref={formPersonaFisicaRef}/>
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
                    onClick={() => {console.log(`personaFisica: ${JSON.stringify(formPersonaFisicaRef.current.onSubmit())}, personaGiuridica: void`)}}
                    sx={{width: '90px', color: 'white', backgroundColor: '#108d10', '&:hover, &:hover svg':{backgroundColor: '#119c11', color: 'white'}}}
                    startIcon={<AddIcon sx={{color: 'white', transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'}}/>}
                >
                    Crea
                </Button>
            </Grid>
        </div>
    )
}

function CompilaCampiObbligatoriAlert() {
    var [isOpen, setIsOpen] = React.useState(false)

    return (
      <Stack sx={{ width: '100%', zIndex: '99', position: 'sticky', bottom: '0', display: 'flex', alignItems: 'center'}} spacing={2}>
        { isOpen && <Alert open onClose={() => {setIsOpen(false)}} severity="warning" sx={{width: '60%', '& .MuiAlert-message':{display: 'flex', justifyItems: 'center', alignItems: 'center'}}}>
          Per procedere all verifica compila i campi 'Nome', 'Cognome', 'Codice fiscale'
        </Alert> }
      </Stack>
    );
}

