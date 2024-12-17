import React from 'react';
import {
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useTheme } from '@mui/material/styles';

const Accordion = ({ title, titleSx, children, isDisabled, isExpanded }) => {
  const theme = useTheme();

  return (
    <MuiAccordion disabled={isDisabled} expanded={isExpanded}>
      <AccordionSummary
        expandIcon={<ArrowDownwardIcon sx={{ color: 'white' }} />}
        sx={{
          backgroundColor: '#467bae',
          color: 'white',
          height: '48px',
          '&.Mui-expanded': { minHeight: 'unset' },
        }}
      >
        <Typography sx={titleSx} style={{fontSize: '1.2rem'}}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{ backgroundColor: theme.palette.background.default, marginTop: '1rem' }}
      >
        {children}
      </AccordionDetails>
    </MuiAccordion>
  );
};

export default Accordion;
