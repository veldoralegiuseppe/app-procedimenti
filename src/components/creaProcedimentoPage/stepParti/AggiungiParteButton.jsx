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

export default function AggiungiParteButton(props) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const theme = useTheme()
    const style = {
        position: 'absolute',
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
    const buttonColor = '#82b9ec'
    const buttonHoverColor = '#4a769b'
      

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
                    <Typography id="keep-mounted-modal-title" variant="h5" component="h2">
                        Creazione Parte
                    </Typography>
                    <Creazione sx={{margin: '3rem 0 0 0'}}/>
                </Box>
            </Modal>
        </div>
    )
}

function Creazione(props){
    const theme = useTheme()
    const formLabelFontSize = '1rem'
    const backgroundColor = theme.palette.background.default
    const labelColor = 'rgb(105 105 105 / 60%)'
    const [tipologiaPersona, setTipologiaPersona] = React.useState('');
    const inputSx = {width: '20%', margin: '18px 20px 10px 0px', minWidth: '133.5px', maxWidth: '168px',}
    const textFieldSx = {'& .MuiFormLabel-root:not(.Mui-error)':{color: labelColor}, '& .MuiOutlinedInput-input':{fontWeight: '500', color: theme.palette.text.primary,}, ...inputSx}

    const buttonColor = '#82b9ec'
    const buttonHoverColor = '#4a769b'

    const handleChange = (event) => {
      setTipologiaPersona(event.target.value);
    };

    return (
        <div style={{position: 'relative', display: 'flex', flexDirection:'column', alignItems: 'flex-start', justifyContent:'center', rowGap:'3rem', padding: '0', ...props.sx}}>       
            {/* Dati del soggetto */}
            <Grid xs={12} sx={{width: '100%'}}>
                <Grid xs={12} sx={{borderBottom:'1px solid #467bae61',}}><Typography sx={{fontWeight: '400', fontSize: formLabelFontSize, color: '#467bae'}}>Dati del soggetto</Typography></Grid>
                
                <FormControl 
                    required
                    size='small'
                    sx={{'& .MuiFormLabel-root:not(.Mui-error)':{color: labelColor}, ...inputSx}}
                >
                <InputLabel id="tipologia-persona-select-label">Tipologia persona</InputLabel>
                <CssSelect
                    labelId="tipologia-persona-select-label"
                    id="tipologia-persona-select"
                    value={tipologiaPersona}
                    label="Tipologia persona"
                    onChange={handleChange}
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
                                    //overflowY: 'scroll'
                                },
                            },
                        },
                    }}
                    sx={{'& .MuiOutlinedInput-input':{fontWeight: '500', color: theme.palette.text.primary}, }}
                >
                    <MenuItem value={'PERSONA_FISICA'}>PERSONA FISICA</MenuItem>
                    <MenuItem value={'PERSONA_GIURIDICA'}>PERSONA GIURIDICA</MenuItem>
                </CssSelect>
                </FormControl>

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
            </Grid>

            {/* Domicilio */}
            <Grid xs={12} sx={{width: '100%'}}>
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
                    sx={textFieldSx}
                />
            </Grid>

            <Grid xs={12} sx={{width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '3rem'}}>
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
            </Grid>
        </div>
    )
}


const CssTextField = styled(TextField)(({ theme }) => ({

    //  '& .MuiInputLabel-root[data-shrink="true"]':{
    //     color: theme.palette.logo.secondary,
  
    //     '& ~ .MuiInputBase-root fieldset':{ borderColor: theme.palette.logo.secondary,}
    //   },
  
      '& .MuiInputLabel-root.Mui-focused':{ color: theme.palette.logo.secondary,},
      '& .MuiOutlinedInput-root': {
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
