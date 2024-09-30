import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import ProvinciaSelect from '/src/components/provinciaSelect/ProvinciaSelect.jsx';
import ComuneSelect from '/src/components/comuneSelect/ComuneSelect.jsx';
import ImportoField from '/src/components/importoField/ImportoField.jsx';
import { PersonaGiuridica } from '/src/vo/personaGiuridica.js';

// Funzioni di validazione
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePartitaIVA = (piva) => /^[0-9]{11}$/.test(piva);
const validateDenominazione = (denominazione) => /^(?![-\s]+$)[A-Za-z0-9\s\-]{3,50}$/.test(denominazione);
const validateAvvocato = (avvocato) => {
    const regex = /^[A-Za-zÀ-ÿ\s\-]{1,50}$/; // Consente lettere, spazi e trattini, lunghezza 1-50
    return regex.test(avvocato);
}

// Costanti di layout 
const inputHeight = 35  //Altezza effettiva 
const gridRowHeight = inputHeight +  34 + 3 // Input + Margine + Helper text 

function FormPersonaGiuridica(props, ref) {
    
    var comuneSedeLegaleRef = React.useRef()
    const [capSedeLegale, setCapSedeLegale] = React.useState("");
    const theme = useTheme();
    const textFieldSx = {
        '& .MuiFormLabel-root:not(.Mui-error,.Mui-focused,.Mui-selected)': { color: 'rgb(105 105 105 / 60%)' },
        '& .MuiFormLabel-root.Mui-disabled': { color: 'rgb(148 148 148 / 60%)' },
        '& .MuiOutlinedInput-input': { fontWeight: '500', color: theme.palette.text.primary },
        maxWidth: '300px', margin: '14px 20px 10px 0px', width: '40%', height: `${inputHeight}px`
    };
    const [parteAttuale, setParteAttuale] = React.useState(new PersonaGiuridica());

    React.useImperativeHandle(ref, () => ({onSubmit(){ return parteAttuale}}),)

    return (
        <div style={{ position: 'relative', marginTop: '1rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', rowGap: '2.8rem', padding: '0' }}>
            {/* Dati societari */}
            <Grid xs={12} sx={{width: '100%', minHeight: `${gridRowHeight}px`}}>
                <Grid xs={12} sx={{ width: '100%', borderBottom: '1px solid #467bae61' }}>
                    <Typography sx={{ fontWeight: '400', fontSize: '1rem', color: '#467bae' }}>Dati societari</Typography>
                </Grid>

                <CssTextField
                    size='small'
                    label="Partita IVA"
                    error={parteAttuale.partitaIVA ? !validatePartitaIVA(parteAttuale.partitaIVA) : false}
                    helperText={parteAttuale.partitaIVA && !validatePartitaIVA(parteAttuale.partitaIVA) ? "Partita IVA non valida" : ""}
                    onChange={(event) => setParteAttuale({ ...parteAttuale, partitaIVA: event.target.value })}
                    sx={textFieldSx}
                />

                <CssTextField
                    required
                    size='small'
                    label="Denominazione"
                    error={parteAttuale.denominazione ? !validateDenominazione(parteAttuale.denominazione) : false}
                    helperText={parteAttuale.denominazione && !validateDenominazione(parteAttuale.denominazione) ? "Denominazione non valida" : ""}
                    onChange={(event) => setParteAttuale({ ...parteAttuale, denominazione: event.target.value.toUpperCase() })}
                    sx={textFieldSx}
                />
            </Grid>

            {/* Sede legale */}
            <Grid xs={12} sx={{width: '100%', minHeight: `${gridRowHeight}px`}}>
                <Grid xs={12} sx={{ width: '100%', borderBottom: '1px solid #467bae61' }}>
                    <Typography sx={{ fontWeight: '400', fontSize: '1rem', color: '#467bae' }}>Sede Legale</Typography>
                </Grid>

                <ProvinciaSelect
                    label="Provincia"
                    onChange={(value) =>  comuneSedeLegaleRef.current.setProvincia(value)}
                    sx={textFieldSx}
                />

                <ComuneSelect
                    ref={comuneSedeLegaleRef} 
                    provincia={parteAttuale.provincia} 
                    label="Comune"
                    onChange={(value) => {
                        setCapSedeLegale(value && value.cap ? value.cap : "");
                        setParteAttuale({ ...parteAttuale, sedeLegale: value })
                    }}
                    sx={textFieldSx}
                />

                <CssTextField
                    size='small'
                    label="CAP"
                    disabled={true}
                    value={capSedeLegale}
                    sx={textFieldSx}
                />
            </Grid>

            {/* Recapiti */}
            <Grid xs={12} sx={{width: '100%', minHeight: `${gridRowHeight}px`}}>
                <Grid xs={12} sx={{ width: '100%', borderBottom: '1px solid #467bae61' }}>
                    <Typography sx={{ fontWeight: '400', fontSize: '1rem', color: '#467bae' }}>Recapiti</Typography>
                </Grid>

                <CssTextField
                    size='small'
                    label="Email"
                    error={parteAttuale.email ? !validateEmail(parteAttuale.email) : false}
                    helperText={parteAttuale.email && !validateEmail(parteAttuale.email) ? "Email non valida" : ""}
                    onChange={(event) => setParteAttuale({ ...parteAttuale, email: event.target.value })}
                    sx={textFieldSx}
                />

                <CssTextField
                    size='small'
                    label="PEC"
                    onChange={(event) => setParteAttuale({ ...parteAttuale, pec: event.target.value.toUpperCase() })}
                    sx={textFieldSx}
                />
            </Grid>

             {/* Assistenza legale */}
            <Grid xs={12} sx={{width: '100%', minHeight: `${gridRowHeight}px`}}>
            <Grid xs={12} sx={{borderBottom:'1px solid #467bae61',}}><Typography sx={{fontWeight: '400', fontSize: '1rem', color: '#467bae'}}>Rappresentante legale</Typography></Grid>
                <CssTextField
                required
                size='small'
                id="outlined-required-avvocato"
                label="Avvocato"
                error={parteAttuale.assistenzaLegale ? !validateAvvocato(parteAttuale.assistenzaLegale) : false}
                helperText={parteAttuale.assistenzaLegale && !validateAvvocato(parteAttuale.assistenzaLegale) ? "Nome non valido" : ""}
                onChange={(event) => {
                    parteAttuale.assistenzaLegale = event.currentTarget.value.toLocaleUpperCase();
                    setParteAttuale({ ...parteAttuale });
                }}
                defaultValue=""
                sx={{ ...textFieldSx, minWidth: '246px', maxWidth: '250px' }}
                />
            </Grid>

            {/* Spese di mediazione */}
            <Grid xs={12} sx={{width: '100%', minHeight: `${gridRowHeight}px`}}>
                <Grid xs={12} sx={{borderBottom:'1px solid #467bae61',}}><Typography sx={{fontWeight: '400', fontSize: '1rem', color: '#467bae'}}>Spese di mediazione</Typography></Grid>
                
                <ImportoField 
                    importo={'0,00'} 
                    onChange={(value) => setParteAttuale({ ...parteAttuale, speseAvvio: value })} 
                    sx={{...textFieldSx, maxWidth: "168px",}} 
                    label={"Spese di avvio"} 
                    required={true}
                />

                <ImportoField 
                    importo={'0,00'} 
                    onChange={(value) => setParteAttuale({ ...parteAttuale, spesePostali: value })} 
                    sx={{...textFieldSx, maxWidth: "168px",}} 
                    label={"Spese postali"} 
                    required={true}
                />

<               ImportoField 
                    importo={'0,00'} 
                    onChange={(value) => setParteAttuale({ ...parteAttuale, pagamentoIndennita: value })} 
                    sx={{...textFieldSx, maxWidth: "168px",}} 
                    label={"Pagamento indennità"} 
                    required={true}
                />

            </Grid>

            {/* Note */}
            <Grid xs={12} sx={{width: '100%', minHeight: `${gridRowHeight+80}px`}}>
                <Grid xs={12} sx={{borderBottom:'1px solid #467bae61',}}><Typography sx={{fontWeight: '400', fontSize: '1rem', color: '#467bae'}}>Informazioni aggiuntive</Typography></Grid>
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
    );
}

const CssTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        'input': { textTransform: 'uppercase' },
        '&:hover:not(.Mui-disabled) fieldset': { borderColor: theme.palette.logo.secondary },
        '&.Mui-focused:not(.Mui-error) fieldset': { border: `1.2px solid ${theme.palette.logo.secondary}` },
        '&.Mui-disabled': { backgroundColor: '#efefef73' },
        '&.Mui-disabled fieldset': { borderColor: '#eaeaea' }
    }
}));

export default React.forwardRef(FormPersonaGiuridica);
