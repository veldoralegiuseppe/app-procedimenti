import * as React from 'react';
import {
  Box,
  SpeedDial,
  SpeedDialAction,
  Button,
  Typography,
} from '@mui/material';
import {
  Rule as RuleIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

import { FormModal } from '@ui-shared/components';
import SvgCartoonRobot from '@assets/img/cartoon_robot.svg';
import RuleTable from './components/RuleTable/RuleTable';
import { ProcedimentoContext } from '@ui-shared/context';
import { getEspressioneCondizione, getEspressione } from '@features/regola';
import RuleBuilder from './components/RuleBuilders/RuleBuilder';

function FragmentWithProps({ children, onError, onSuccess, sx }) {
  return (
    <div style={{ ...sx }}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              ...(onError && { onError }), // Passa onError solo se definito
              ...(child.type &&
                (child.type.name === 'RuleBuilder' ||
                  child.type.name === 'RuleTable') && { onSuccess }),
            })
          : child
      )}
    </div>
  );
}

const ModaleRegole = ({ open, handleClose, onError, onSuccess }) => {
  const { regole, setRegole } = React.useContext(ProcedimentoContext);
  const [mode, setMode] = React.useState('view');
  const [rule, setRule] = React.useState(null);
  const [body, setBody] = React.useState([]);

  const onClose = () => {
    setMode('view');
    handleClose();
  };

  const handleDelete = (index) => {
    console.log('onDelete', index);
    setRegole((prev) => {
      const newRegole = [...prev];
      newRegole.splice(index, 1);
      return newRegole;
    });
    return true;
  };

  const handleModify = (index) => {
    console.log('onModify', index);
    setMode('modify');
    setRule({ ...regole[index] });
  };

  const handleCreate = () => {
    setMode('create');
  };

  const handleAttivoChange = (index, status) =>
    setRegole((prev) => {
      const newRegole = [...prev];
      newRegole[index].stato = status;
      return newRegole;
    });

  const onEndOperation = () => {
    setMode('view');
    setRule(null);
  };

  React.useEffect(() => {
    console.log('regole', regole);
    setBody(
      regole.map((r) => [
        r.stato,
        r.espressione.target.label,
        getEspressioneCondizione(r) || 'N/A',
        r.isApplicata == true ? 'APPLICATA' : 'NON APPLICATA',
        'N/A',
      ])
    );

    console.log('body updated', regole[0].isApplicata);
  }, [regole]);

  const renderContent = () => {
    switch (mode) {
      case 'view':
        return (
          <FragmentWithProps
            onError={onError}
            onSuccess={onSuccess}
            sx={{ height: '100%' }}
          >
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
              body={body}
              getCollapsibleComponent={(row, index) => (
                <CollapsibleRow row={row} index={index} />
              )}
              onDelete={handleDelete}
              onModify={handleModify}
              handleAttivoChange={handleAttivoChange}
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
            onSuccess={onSuccess}
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
            <RuleBuilder
              mode={mode}
              onEndOperation={onEndOperation}
              rule={mode === 'modify' ? rule : null}
            />
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
          icon={<SvgCartoonRobot style={{ width: '23px' }} />}
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
