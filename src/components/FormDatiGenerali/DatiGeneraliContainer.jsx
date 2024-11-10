import * as React from 'react';
import DatiGeneraliForm from './DatiGeneraliForm';
import { ProcedimentoContext } from '@context/Procedimento';
import { Procedimento } from '@model/procedimento';


const DatiGeneraliContainer = () => {
  const [errors, setErrors] = React.useState({});
  const { procedimento, handleInputChange } = React.useContext(ProcedimentoContext);
  const metadati = Procedimento.getMetadati();

  const setProcedimento = (changes) => {
    setErrors(handleInputChange(changes, metadati));
  }
  
  return (
    <DatiGeneraliForm
      errors={errors}
      metadati={metadati}
      procedimento={procedimento}
      onChange={setProcedimento}
      sezione={'Istanza di mediazione'}
    />
  );
};

export default DatiGeneraliContainer;
