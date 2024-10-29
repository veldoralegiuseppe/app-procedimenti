import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import RuleIcon from '@mui/icons-material/Rule';

import FormModal from '@components/FormModal';
import SvgCartoonRobot from '@assets/img/cartoon_robot.svg';

function ModaleRegole({ open, handleClose }) {
  return (
    <FormModal title="Gestionale Regole" open={open} handleClose={handleClose}>
      <div>Prova</div>
    </FormModal>
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
