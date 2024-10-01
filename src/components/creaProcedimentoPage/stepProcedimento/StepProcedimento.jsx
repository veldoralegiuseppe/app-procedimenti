import * as React from 'react';
import { Typography, InputAdornment, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { LocalizationProvider, MobileDatePicker, } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { itIT } from '@mui/x-date-pickers/locales';
import dayjs from 'dayjs';
import 'dayjs/locale/it';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import DeleteIcon from '@mui/icons-material/Delete';

import RegistroProcedimentoButton from './RegistroProcedimentoButton.jsx';
import ImportoField from '/src/components/importoField/ImportoField.jsx';
import { CssTextField, ClearButton, labelColor } from '/src/components/Theming.jsx';
import { Procedimento } from '/src/vo/procedimento.js';
import SelectForm from '@components/selectForm/SelectForm';

const oggettiControversia = [
  {value: 'ALTRE NATURE DELLA CONTROVERSIA', view: 'ALTRE NATURE DELLA CONTROVERSIA'}, 
  {value:'CONTRATTI BANCARI', view: 'CONTRATTI BANCARI'}, 
  {value:'CONTRATTI FINANZIARI', view:'CONTRATTI FINANZIARI'}, 
  {value: 'CONTRATTI DI OPERA', view: 'CONTRATTI D\'OPERA'}, 
  {value:'CONTRATTI DI RETE', view: 'CONTRATTI DI RETE'}, 
  {value:'CONTRATTI DI SOMMINISTRAZIONE', view:'CONTRATTI DI SOMMINISTRAZIONE'}, 
  {value:'CONSORZIO', view:'CONSORZIO'}, 
  {value:'DIRITTI REALI', view:'DIRITTI REALI'}, 
  {value:'DIVISIONE', view:'DIVISIONE'}, 
  {value:'FRANCHISING', view:'FRANCHISING'}, 
  {value: 'LOCAZIONE', view: 'LOCAZIONE'}, 
  {value:'PATTI DI FAMIGLIA', view:'PATTI DI FAMIGLIA'}, 
  {value: 'RESPONSABILITA MEDICA', view: 'RESPONSABILITÀ MEDICA'}, 
  {value:'RISARCIMENTO DANNI MEZZO STAMPA', view:'RISARCIMENTO DANNI MEZZO STAMPA'}, 
  {value:'SUCCESSIONE EREDITARIA', view:'SUCCESSIONE EREDITARIA'}, 
  {value: 'SOCIETA DI PERSONE', view:'SOCIETÀ DI PERSONE'}, 
  {value: 'SUBFORNITURA', view: 'SUBFORNITURA'}
]
const inputStyles = (theme, inputWidth, minWidth, maxWidth, margin, backgroundColor) => ({
  margin,
  backgroundColor,
  minWidth: inputWidth,
  maxWidth,
  '& .MuiOutlinedInput-input': { fontWeight: '500' },
  '&:hover .MuiSvgIcon-root': { color: theme.palette.logo.secondary },
  '&.Mui-focused .MuiSvgIcon-root': { color: theme.palette.logo.secondary },
});

function StepProcedimento() {
  const theme = useTheme();
  const [procedimento, setProcedimento] = React.useState(new Procedimento());
  const [initialProc] = React.useState(new Procedimento()); // Stato iniziale da comparare
  const inputWidth = '20%';
  const minWidth = '133.5px';
  const maxWidth = '168px';
  const margin = '18px 20px 0px 0px';
  const backgroundColor = theme.palette.background.default;
  const formLabelFontSize = '1rem';

  const handleReset = () => {
    setProcedimento(new Procedimento());
  };

  // Funzione per verificare se ci sono modifiche
  const isModified = () => {
    return JSON.stringify(procedimento) !== JSON.stringify(initialProc);
  };

  return (
    <form id='step-procedimento-form' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', rowGap: '4rem', padding: '4.5rem 0' }}>
      {/* Procedimento di mediazione */}
      <Grid xs={12}>
        <Grid xs={12} sx={{ borderBottom: '1px solid #467bae61', margin: '0 0 0 1rem', width: 'calc(100% - 1rem)' }}>
          <Typography sx={{ fontWeight: '400', fontSize: formLabelFontSize, color: '#467bae' }}>Procedimento di mediazione</Typography>
        </Grid>

        <Grid xs={12} sx={{ paddingLeft: '1rem' }}>
          {/* Numero di procedimento */}
          <RegistroProcedimentoButton 
            onChange={(numProtocollo, anno) => {
              setProcedimento((prev) => ({
                ...prev,
                numProtocollo,
                annoProtocollo: anno,
              }));
            }}
            numProtocollo={procedimento.numProtocollo}
            anno={procedimento.annoProtocollo}
            sx={{ maxWidth, minWidth, margin }}
          />

          {/* Data deposito */}
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it" localeText={itIT.components.MuiLocalizationProvider.defaultProps.localeText}>
            <MobileDatePicker
              label="Data deposito"
              value={dayjs(procedimento.dataDeposito)}
              onChange={(value) => {
                setProcedimento((prev) => ({
                  ...prev,
                  dataDeposito: new Date(value),
                  dataDepositoLocale: new Date(value).toLocaleDateString('it-IT'),
                }));
              }}
              sx={inputStyles(theme, inputWidth, minWidth, maxWidth, margin, backgroundColor)}
              slots={{ textField: CssTextField }}
              slotProps={{
                textField: {
                  error: false,
                  InputProps: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <CalendarMonthOutlinedIcon sx={{ color: false ? theme.palette.error.main : labelColor }} />
                      </InputAdornment>
                    ),
                  },
                  size: "small",
                },
              }}
            />
          </LocalizationProvider>

          {/* Sede caricamento */}
          <CssTextField
            required
            size='small'
            id="outlined-required-sede"
            label="Sede"
            value={procedimento.sede || ""}
            onChange={(event) => {
              setProcedimento((prev) => ({ ...prev, sede: event.target.value }));
            }}
            sx={inputStyles(theme, inputWidth, minWidth, maxWidth, margin, backgroundColor)}
          />

          {/* Sede svolgimento */}
          <CssTextField
            required
            size='small'
            id="outlined-required-sede-svolgimento"
            label="Sede svolgimento"
            value={procedimento.sedeSvolgimento || ""}
            onChange={(event) => {
              setProcedimento((prev) => ({ ...prev, sedeSvolgimento: event.target.value }));
            }}
            sx={inputStyles(theme, inputWidth, minWidth, maxWidth, margin, backgroundColor)}
          />
        </Grid>
      </Grid>

      {/* Controversia */}
      <Grid xs={12}>
        <Grid xs={12} sx={{ borderBottom: '1px solid #467bae61', margin: '0 0 0 1rem', width: 'calc(100% - 1rem)' }}>
          <Typography variant="h6" sx={{ fontWeight: '400', fontSize: formLabelFontSize, color: `#467bae` }}>Controversia</Typography>
        </Grid>

        <Grid xs={12} sx={{ paddingLeft: '1rem' }}>
          {/* Oggetto di controversia */}
          <SelectForm 
            label="Oggetto Controversia"
            value={procedimento.oggettoControversia || ""}
            onChange={(event) => {
              setProcedimento((prev) => ({ ...prev, oggettoControversia: event.target.value }));
            }}
            options={oggettiControversia}
          />

          {/* Valore della controversia */}
          <ImportoField
            importo={procedimento.valoreControversia}
            onChange={(valore) => {
              setProcedimento((prev) => ({
                ...prev,
                valoreControversia: valore.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
              }));
            }}
            sx={{ margin, backgroundColor, width: inputWidth, minWidth, maxWidth }}
            label="Valore della controversia"
            required={true}
          />
        </Grid>
      </Grid>

      {/* Reset button */}
      <Grid xs={12} sx={{ display: 'flex', justifyContent: 'start', margin: '1rem 0 0 1rem', width: 'calc(100% - 1rem)' }}>
        <ClearBtn onReset={handleReset} isDisabled={!isModified()} />
      </Grid>
    </form>
  );
}

function ClearBtn({ onReset, isDisabled }) {
  const theme = useTheme();

  return (
    <ClearButton 
      variant="outlined" 
      onClick={onReset} 
      startIcon={<DeleteIcon sx={{ color: isDisabled ? 'rgb(105 105 105 / 60%)' : theme.palette.primary.main }} />} 
      sx={{ fontSize: '.9rem', '&.Mui-disabled': { color: theme.palette.text.disabled, fontWeight: '400' } }} 
      disabled={isDisabled}
    >
      Pulisci campi
    </ClearButton>
  );
}

export default React.forwardRef(StepProcedimento);
