import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
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


const steps = ['Definisci il procedimento', 'Definisci le parti', 'Create an ad'];

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const theme = useTheme()

  // FORM SELECT PROVA
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const isStepOptional = (step) => {
    return false
    //return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: theme.palette.background.default, borderRadius: '8px', padding: '16px 16px', alignItems: 'center' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps} sx={{'& .MuiSvgIcon-root':{width: '2.5rem', height:'2.5rem'}, '& .MuiSvgIcon-root text':{fontSize: '1rem', fill: 'white'} }}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <div style={{display: 'flex', flexDirection: 'column', rowGap: '2rem', marginTop: '3rem'}}>
        {activeStep === steps.length ? (
            <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleReset}>Reset</Button>
            </Box>
            </React.Fragment>
        ) : (
            <React.Fragment>
           

            <Grid xs={12}>
                <Grid xs={12}><Typography variant="h6" sx={{fontWeight: '600', fontSize: '1.25rem', padding: '0 0 0 1rem' }}>Procedimento di Mediazione</Typography></Grid>
                
                <TextField sx={{margin: '10px', backgroundColor: 'rgb(248,250,252)'}} id="outlined-basic" label="Numero" variant="outlined" size='small' required/>

                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='it' localeText={itIT.components.MuiLocalizationProvider.defaultProps.localeText}>
                    <MobileDatePicker 
                    label='Data deposito'
                    sx={{margin: '10px', backgroundColor: 'rgb(248,250,252)', width: '132.5px'}}
                    slotProps={{
                        textField: {
                            InputProps: {
                            endAdornment: (
                                <InputAdornment position="end">
                                <CalendarMonthOutlinedIcon />
                                </InputAdornment>
                            ),
                            },
                            size: 'small'
                        },
                    }}
                    />
                </LocalizationProvider>

                <SedeSelect></SedeSelect>

                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='it' localeText={itIT.components.MuiLocalizationProvider.defaultProps.localeText}>   
                    <MobileDateTimePicker
                    label='Data incontro'
                    //slotProps={{ textField: { size: 'small' } }} 
                    sx={{margin: '10px', backgroundColor: 'rgb(248,250,252)', width: '132.5px'}}
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

            {/* <Typography variant="h6" sx={{fontWeight: '600', fontSize: '1.25rem', padding: '0 0 0 1rem' }}>Controversia</Typography> */}
         
            <Grid xs={12}>
                <Grid xs={12}><Typography variant="h6" sx={{fontWeight: '600', fontSize: '1.25rem', padding: '0 0 0 1rem' }}>Controversia</Typography></Grid>

                <FormControl size='small' sx={{width: '132.5px', margin: '10px', backgroundColor: 'rgb(248,250,252)'}}>
                        <InputLabel id="oggetto-controversia-input-label">Oggetto</InputLabel>
                        <Select
                        labelId="oggetto-controversia-input-label"
                        id="oggetto-controversia-select"
                        value={age}
                        label="Oggetto"
                        size='small'
                        onChange={handleChange}
                        >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                </FormControl>

                <TextField 
                    InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        <EuroSymbolIcon />
                        </InputAdornment>
                    ),
                    }}
                sx={{margin: '10px', backgroundColor: 'rgb(248,250,252)', width: '132.5px'}} 
                id="outlined-basic" 
                label="Valore della controversia" 
                variant="outlined" 
                size='small' 
                required/>
            </Grid>

            <Grid xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                    >
                    Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    {isStepOptional(activeStep) && (
                    <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                        Skip
                    </Button>
                    )}

                    <Button onClick={handleNext}>
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </Box>
            </Grid>
            
            </React.Fragment>
        )}
      </div>
    </Box>
  );
}