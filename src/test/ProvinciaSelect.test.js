import * as React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import '@testing-library/jest-dom';

import { themeOne } from '@ui-shared/theme';
import ProvinciaSelect from '@ui-shared/components';
import * as ComuniUtils from '@assets/js/comuni';
import { provinceCampania } from './mock/mockProvinceComuni';

// Mock della funzione getProvince
jest.mock('@assets/js/comuni', () => ({
  ...jest.requireActual('@assets/js/comuni'),
  getProvince: jest.fn(),
}));

beforeEach(() => {
  // Mock della funzione getProvince per restituire un array di province simulato.
  ComuniUtils.getProvince.mockResolvedValue(provinceCampania);
});

test('dovrebbe caricare e mostrare le province nel campo ProvinciaSelect', async () => {
  await act(async () => {
    render( 
        <ThemeProvider theme={themeOne}>
            <ProvinciaSelect /> 
        </ThemeProvider>
);
  });

  // Simula un click sul campo autocomplete per aprire il menu a tendina.
  const provinciaInput = screen.getByLabelText(/Provincia/i);
  fireEvent.mouseDown(provinciaInput);

  // Attende che l'elemento `listbox` appaia.
  const listbox = await screen.findByRole('listbox');

  // Verifica che le opzioni "MILANO" e "ROMA" siano presenti nel `listbox`.
  expect(listbox).toBeInTheDocument();
  expect(screen.getByText('SALERNO')).toBeInTheDocument();
  expect(screen.getByText('NAPOLI')).toBeInTheDocument();
});
