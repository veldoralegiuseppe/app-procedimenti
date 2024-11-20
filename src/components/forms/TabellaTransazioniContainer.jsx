import * as React from 'react';

const transazioni = [
  {
    transazione: { tipo: 'entrata', nome: 'Incasso parti' },
    importo: {
      component: ImportoReadOnly,
      value: 0,
      backgroundColor: '#cacaca29',
      isDisabled: true,
    },
    stato: {
      value: 'DA SALDARE',
      status: 'error',
    },
  },
  {
    transazione: { tipo: 'entrata', nome: 'Incasso controparti' },
    importo: {
      component: ImportoReadOnly,
      value: 0,
      backgroundColor: '#cacaca29',
      isDisabled: true,
    },
    stato: {
      value: 'DA SALDARE',
      status: 'error',
    },
  },
  {
    transazione: { tipo: 'uscita', nome: 'Compenso mediatore' },
    importo: { component: ImportoInput, value: 0 },
    stato: {
      value: 'DA SALDARE',
      status: 'error',
    },
  },
  {
    transazione: { tipo: 'uscita', nome: 'Spese avvio sede secondaria' },
    importo: { component: ImportoInput, value: 0 },
    stato: {
      value: 'DA SALDARE',
      status: 'error',
    },
  },
  {
    transazione: { tipo: 'uscita', nome: 'Spese indennità sede secondari' },
    importo: { component: ImportoInput, value: 0 },
    stato: {
      value: 'DA SALDARE',
      status: 'error',
    },
  },
];

const TabellaTransazioniContainer = ({transazioni}) => {
    const [transactions, setTransactions] = React.useState(() => {
        return transazioni.map((tr) => ({
            transazione: tr,
            importo: {},
            stato: { ...row.stato, onClick: (row) => handleSpasaStatusChange(row) },
        }));
    });


};

export default TabellaTransazioniContainer;
