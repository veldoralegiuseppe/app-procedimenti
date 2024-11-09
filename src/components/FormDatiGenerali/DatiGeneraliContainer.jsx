import * as React from 'react';
import DatiGeneraliForm from './DatiGeneraliForm';
import { ProcedimentoContext } from '@context/Procedimento';


const DatiGeneraliContainer = () => {
  const [errors, setErrors] = React.useState({});
  const { procedimento, handleProcedimentoChange } = React.useContext(ProcedimentoContext);

  const setProcedimento = (changes) => {
    setErrors(handleProcedimentoChange(changes));
  }
  
  return (
    <DatiGeneraliForm
      errors={errors}
      procedimento={procedimento}
      onChange={setProcedimento}
      sezione={'Istanza di mediazione'}
    />
  );
};

export default DatiGeneraliContainer;
