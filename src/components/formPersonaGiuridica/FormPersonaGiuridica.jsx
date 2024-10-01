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
import ReadOnlyAmountField from '/src/components/readOnlyAmountField/ReadonlyAmountField.jsx';

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
    const [totaleSpese, setTotaleSpese] = React.useState(0);

    React.useImperativeHandle(ref, () => ({onSubmit(){ return parteAttuale}}),)

    // Effetto che calcola il totale quando cambiano gli importi
    React.useEffect(() => {
        const totale =
        parseImporto(parteAttuale.speseAvvio) +
        parseImporto(parteAttuale.spesePostali) +
        parseImporto(parteAttuale.pagamentoIndennita) +
        parseImporto(parteAttuale.importoMancatoAccordo) +
        parseImporto(parteAttuale.importoPositivoPrimoIncontro) +
        parseImporto(parteAttuale.importoPositivoOltrePrimoIncontro);

        setTotaleSpese(totale.toFixed(2)); // Fissa il totale a due decimali
    }, [parteAttuale]);

    const parseImporto = (importo) => {
        //console.log(`importoInput: ${importo} - importoNumber: ${Number(importo)}`)
        return Number(importo);
      };


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
                    label="PEC / Email"
                    error={parteAttuale.pecEmail ? !validateEmail(parteAttuale.pecEmail) : false}
                    helperText={parteAttuale.pecEmail && !validateEmail(parteAttuale.pecEmail) ? "Indirizzo non valido" : ""}
                    onChange={(event) => setParteAttuale({ ...parteAttuale, pecEmail: event.target.value.toLocaleUpperCase() })}
                    sx={textFieldSx}
                />
            </Grid>

             {/* Assistenza legale */}
            <Grid xs={12} sx={{width: '100%', minHeight: `${gridRowHeight}px`}}>
                <Grid xs={12} sx={{borderBottom:'1px solid #467bae61',}}><Typography sx={{fontWeight: '400', fontSize: '1rem', color: '#467bae'}}>Rappresentante legale</Typography></Grid>
                
                {/* Avvocato */}
                <CssTextField
                required
                size='small'
                id="outlined-required-avvocato"
                label="Avvocato"
                error={parteAttuale.rappresentanteLegale ? !validateAvvocato(parteAttuale.rappresentanteLegale) : false}
                helperText={parteAttuale.rappresentanteLegale && !validateAvvocato(parteAttuale.rappresentanteLegale) ? "Nome non valido" : ""}
                onChange={(event) => {
                    parteAttuale.rappresentanteLegale = event.currentTarget.value.toLocaleUpperCase();
                    setParteAttuale({ ...parteAttuale });
                }}
                defaultValue=""
                sx={{ ...textFieldSx, minWidth: '246px', maxWidth: '250px' }}
                />

                {/* PEC / Email */}
                <CssTextField
                    size='small'
                    label="PEC / Email"
                    error={parteAttuale.rappresentanteLegalePecEmail ? !validateEmail(parteAttuale.rappresentanteLegalePecEmail) : false}
                    helperText={parteAttuale.rappresentanteLegalePecEmail && !validateEmail(parteAttuale.rappresentanteLegalePecEmail) ? "Indirizzo non valido" : ""}
                    onChange={(event) => setParteAttuale({ ...parteAttuale, rappresentanteLegalePecEmail: event.target.value.toLocaleUpperCase() })}
                    sx={textFieldSx}
                />
            </Grid>

            {/* Spese di mediazione */}
            <Grid xs={12} sx={{width: '100%', minHeight: `${gridRowHeight}px`}}>
                <Grid xs={12} sx={{borderBottom:'1px solid #467bae61',}}><Typography sx={{fontWeight: '400', fontSize: '1rem', color: '#467bae'}}>Spese di mediazione</Typography></Grid>
                
                {/* Spese */}
                <Grid xs={12} >
                    <ImportoField importo={'0,00'}  sx={{...textFieldSx, maxWidth: "168px",}}  onChange={(importo) => setParteAttuale({ ...parteAttuale, speseAvvio: importo })} label={"Spese di avvio"} required={true} />
                    <ImportoField importo={'0,00'}  sx={{...textFieldSx, maxWidth: "168px",}}  onChange={(importo) => setParteAttuale({ ...parteAttuale, spesePostali: importo })} label={"Spese postali"} required={true} />
                    <ImportoField importo={'0,00'}  sx={{...textFieldSx, maxWidth: "168px",}}  onChange={(importo) => setParteAttuale({ ...parteAttuale, pagamentoIndennita: importo })} label={"Pagamento indennità"} required={true} />
                    <ImportoField importo={'0,00'}  sx={{...textFieldSx, maxWidth: "168px",}}  onChange={(importo) => setParteAttuale({ ...parteAttuale, importoMancatoAccordo: importo })} label={"Mancato accordo"} required={true} />
                    <ImportoField importo={'0,00'}  sx={{...textFieldSx, maxWidth: "168px",}}  onChange={(importo) => setParteAttuale({ ...parteAttuale, importoPositivoPrimoIncontro: importo })} label={"Positivo primo incontro"} required={true} />
                    <ImportoField importo={'0,00'}  sx={{...textFieldSx, maxWidth: "168px",}}  onChange={(importo) => setParteAttuale({ ...parteAttuale, importoPositivoOltrePrimoIncontro: importo })} label={"Positivo oltre primo incontro"} required={true} />
                </Grid>

                {/* Totale */}
                <ReadOnlyAmountField
                    value={totaleSpese}
                    label="Totale Spese"
                    backgroundColor="#d7ebff0f"  
                    textColor="#467bae"         
                    labelColor="#467bae"        
                    borderColor="#467bae38"      
                    euroIconColor="#467bae"
                    helperTextColor='rgb(105 105 105 / 60%)'
                    sx={{ margin: '4rem 20px 10px 0px' }}     
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
