import * as React from 'react';
import {FormDatiGeneraliContainer} from '@features/procedimento';
import { useStoreContext } from '@ui-shared/context';
import { StoreTypes } from '@ui-shared/metadata';

const StepDatiGeneraliProcedimento = React.forwardRef(
  ({ enableNextStep }, ref) => {

    const store = useStoreContext(StoreTypes.PROCEDIMENTO);
    const procedimento = store(state => state.model); 
   
    React.useEffect(() => {
      // Gestione prossimo step
      // let hasErrors = Object.values(errors).some((hasError) => hasError);

      // if (typeof enableNextStep === 'function') {
      //   //console.log('enable next');
      //   try {
      //     //procedimento.validate();
      //     enableNextStep(!hasErrors && requiredFieldsFilled());
      //   } catch (error) {
      //     console.log('error', error);
      //     enableNextStep(false);
      //   }
      //   //enableNextStep(true)
      // }
      console.log('procedimento', procedimento);
    }, [procedimento]);

    return (
      <React.Fragment>
         <FormDatiGeneraliContainer/>
      </React.Fragment>
    );
  }
);

export default StepDatiGeneraliProcedimento;
