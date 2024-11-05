import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import RuleIcon from '@mui/icons-material/Rule';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import FormModal from '@components/FormModal';
import SvgCartoonRobot from '@assets/img/cartoon_robot.svg';
import RuleTable from '@components/RuleTable/RuleTable';
import { ProcedimentoContext } from '@context/Procedimento';
import { getEspressioneCondizione, getEspressione } from '@model/regola';
import RuleBuilder from '@components/RuleBuilders/RuleBuilder';
import { height } from '@mui/system';

function FragmentWithProps({ children, onError, sx }) {
  return (
    <div style={{ ...sx }}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { onError })
          : child
      )}
    </div>
  );
}

const ModaleRegole = ({ open, handleClose, onError }) => {
  const { regole } = React.useContext(ProcedimentoContext);
  const [mode, setMode] = React.useState('view');
  const [rule, setRule] = React.useState(null);

  const onClose = () => {
    setMode('view');
    handleClose();
  };

  const handleDelete = (index) => {
    console.log('onDelete', index);
  };

  const handleModify = (index) => {
    console.log('onModify', index);
    setMode('modify');
    setRule(regole[index]);
  };

  const handleCreate = () => {
    setMode('create');
  };

  const renderContent = () => {
    switch (mode) {
      case 'view':
        return (
          <FragmentWithProps onError={onError} sx={{height: '100%'}}>
            {/* Titolo */}
            <Box
              sx={{
                width: '100%',
                borderBottom: '1px solid #467bae61',
                marginTop: '2.5rem',
              }}
            >
              <Typography variant="h6" sx={{ color: '#467bae' }}>
                Tabella riepilogativa
              </Typography>
            </Box>

            {/* Tabella */}
            <RuleTable
              sx={{ marginTop: '1.5rem' }}
              metadata={[
                { columnType: 'collapsible' },
                { columnName: 'attiva', columnType: 'switch' },
                { columnName: 'campo' },
                { columnName: 'condizione' },
                { columnName: 'stato', columnType: 'chip' },
                { columnName: 'azioni', columnType: 'azioni' },
              ]}
              body={regole.map((r) => [
                r.stato,
                r.espressione.target.label,
                getEspressioneCondizione(r) || 'N/A',
                'NON APPLICATA',
                'N/A',
              ])}
              getCollapsibleComponent={(row, index) => (
                <CollapsibleRow row={row} index={index} />
              )}
              onDelete={handleDelete}
              onModify={handleModify}
            />

            {/* Button creazione */}
            <Button
              onClick={handleCreate}
              variant="text"
              sx={{
                marginTop: '2.5rem',
                color: '#467bae',
                '&:hover, &:hover svg': {
                  backgroundColor: 'unset',
                  color: '#7cb8f2',
                },
              }}
              startIcon={
                <AddIcon
                  sx={{
                    color: '#467bae',
                    transition: 'color 250ms',
                  }}
                />
              }
            >
              Crea nuova regola
            </Button>
          </FragmentWithProps>
        );
      case 'modify':
      case 'create':
        return (
          <FragmentWithProps
            onError={onError}
            sx={{
              marginTop: '2.5rem',
              display: 'flex',
              height: '100%',
              flexDirection: 'column',
              rowGap: '1.5rem',
            }}
          >
            {/* Button indietro */}
            <Button
              onClick={() => setMode('view')}
              variant="text"
              sx={{
                marginBottom: '3rem',
                maxWidth: 'fit-content',
                justifyContent: 'flex-start',
                color: '#467bae',
                '&:hover, &:hover svg': {
                  backgroundColor: 'unset',
                  color: '#7cb8f2',
                },
              }}
              startIcon={
                <ArrowBackIcon
                  sx={{
                    color: '#467bae',
                    transition: 'color 250ms',
                  }}
                />
              }
            >
              Torna al riepilogo
            </Button>

            {/* Stepper */}
            <RuleBuilder mode={mode} rule={mode === 'modify' ? rule : null} />
          </FragmentWithProps>
        );
      default:
        return null;
    }
  };

  return (
    <FormModal
      title={
        mode === 'view'
          ? 'Gestione regole'
          : mode === 'create'
          ? 'Nuova regola'
          : 'Modifica regola'
      }
      open={open}
      handleClose={onClose}
    >
      {renderContent()}
    </FormModal>
  );
};

function CollapsibleRow({ row, index }) {
  const { regole } = React.useContext(ProcedimentoContext);
  const tdStyle = { verticalAlign: 'top', padding: '1rem 1rem 0 0' };

  return (
    <table key={`collapsible-table-${index}`}>
      <tbody>
        <tr>
          <td style={{ ...tdStyle, color: '#467bae' }}>
            <strong>Espressione:</strong>
          </td>
          <td style={tdStyle}>
            {getEspressione ? getEspressione(regole[index]) : 'N/A'}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default function RobotToolbar({ sx }) {
  // State
  const [openToolbar, setOpenToolbar] = React.useState(false);
  const [openModale, setOpenModale] = React.useState(false);

  // Toolbar handler
  const actions = [
    { icon: <RuleIcon sx={{ color: '#0D47A1' }} />, name: 'Regole' },
  ];
  const handleOpen = () => {
    setOpenToolbar(true);
  };
  const handleClose = (actionName) => {
    // Aggiunge un ritardo per evitare conflitti di eventi
    setTimeout(() => {
      setOpenToolbar(false);
      switch (actionName) {
        case 'Regole':
          setOpenModale(true);
          break;
        default:
          break;
      }
    }, 100);
  };

  return (
    <React.Fragment>
      {/* Toolbar */}
      <Box
        sx={{
          transform: 'translateZ(0px)',
          flexGrow: 1,
          position: 'fixed',
          bottom: '-4px',
          right: '-1px',
          ...sx,
        }}
      >
        <SpeedDial
          ariaLabel="SpeedDial tooltip example"
          onClick={openToolbar ? handleClose : handleOpen}
          open={openToolbar}
          FabProps={{
            disableRipple: true,
          }}
          sx={{
            backgroundColor: 'transparent',
            '& .MuiSpeedDial-fab': {
              backgroundColor: 'transparent !important',
              boxShadow: 'none !important',
            },
          }}
          icon={<SvgCartoonRobot style={{ width: '30px' }} />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => handleClose(action.name)}
              sx={{
                '& .MuiButtonBase-root:hover': { backgroundColor: '#e1f1ff' },
              }}
              tooltipOpen
            />
          ))}
        </SpeedDial>
      </Box>

      {/* Modale */}
      <ModaleRegole
        open={openModale}
        handleClose={() => setOpenModale(false)}
      />
    </React.Fragment>
  );
}
