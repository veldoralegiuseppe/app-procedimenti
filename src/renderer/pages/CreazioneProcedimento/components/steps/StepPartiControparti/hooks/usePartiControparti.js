import { useCallback, useEffect, useState } from 'react';
import { ModeTypes, StoreTypes } from '@ui-shared/metadata';
import { ModelTypes } from '@shared/metadata';
import { PersonaEnumsV1 } from '@shared/metadata';
import { useStoreContext } from '@ui-shared/context';
import { usePersoneStore, usePersonaStore } from '@features/persona';
import { getLocalStorage, setLocalStorage } from '@ui-shared/utils';
import { LOCAL_STORAGE_KEY } from '../constants';


const DEFAULT_TIPO_PERSONA = ModelTypes.PERSONA_FISICA;
const DEFAULT_RUOLO_PERSONA = PersonaEnumsV1.ruolo.PARTE_ISTANTE

const getContextFromLocalStorage = () => getLocalStorage(LOCAL_STORAGE_KEY);
const setContextToLocalStorage = (newContext) => setLocalStorage(newContext, LOCAL_STORAGE_KEY);

const usePartiControparti = () => {
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState(() => {
    const context = getContextFromLocalStorage();
    return context?.selectedRowIndices || [];
  });

  const personeStore = useStoreContext(StoreTypes.PERSONE);
  const personaFisicaStore = useStoreContext(StoreTypes.PERSONA_FISICA);
  const personaGiuridicaStore = useStoreContext(StoreTypes.PERSONA_GIURIDICA);

  const { resetModel: resetPersonaFisica } = usePersonaStore(personaFisicaStore);
  const { resetModel: resetPersonaGiuridica } = usePersonaStore(personaGiuridicaStore);
  const { removeItem, getItem, updateItem, addItem } = usePersoneStore(personeStore);

  useEffect(() => {
    
    setContextToLocalStorage({
      mode: ModeTypes.CREATE,
      tipoPersona: DEFAULT_TIPO_PERSONA,
      ruoloPersona: DEFAULT_RUOLO_PERSONA,
      selectedRowIndices: [],
    });

    setSelectedRows([]);

    return () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY)
    };
  }, []);

  const openModal = useCallback((mode) => {
    const context = getContextFromLocalStorage();
    let tipoPersona = DEFAULT_TIPO_PERSONA;
    let ruoloPersona = DEFAULT_RUOLO_PERSONA;
   
    if (mode === ModeTypes.MODIFY) {
      const selectedPersona = getItem(context?.selectedRowIndices?.[0]);
      
      if (selectedPersona) {
        tipoPersona = selectedPersona.type;
        ruoloPersona = selectedPersona.ruolo;

        if (tipoPersona === ModelTypes.PERSONA_FISICA) {
          resetPersonaFisica(selectedPersona);
          resetPersonaGiuridica();
        } else {
          resetPersonaGiuridica(selectedPersona);
          resetPersonaFisica();
        }
      }
    } else {
      resetPersonaFisica();
      resetPersonaGiuridica();
    }

    setContextToLocalStorage({ mode, tipoPersona, ruoloPersona });
    setModalOpen(true);
  }, [getItem, resetPersonaFisica, resetPersonaGiuridica]);

  // Chiusura modale
  const closeModal = useCallback(() => setModalOpen(false), []);

  const handleRowSelection = useCallback((indices) => {
    setContextToLocalStorage({ selectedRowIndices: indices });
    setSelectedRows(indices);
  }, []);

  const deleteSelectedRows = useCallback(() => {
    const context = getContextFromLocalStorage();
    context?.selectedRowIndices?.forEach((index) => {
      removeItem(index);
    });
    setSelectedRows([]);
    setContextToLocalStorage({ selectedRowIndices: [] });
  }, [removeItem]);

  // Gestione delle modifiche (Creazione o Modifica)
  const handleChanges = useCallback((newPersona) => {
    const context = getContextFromLocalStorage();
    if (context?.mode === ModeTypes.CREATE) {
      addItem(newPersona);
    } else if (context?.mode === ModeTypes.MODIFY) {
      const index = context.selectedRowIndices?.[0];
      if (index !== undefined) {
        updateItem(index, newPersona);
      }
    }
  }, [addItem, updateItem]);

  return {
    isModalOpen,
    selectedRows,
    openModal,
    closeModal,
    handleRowSelection,
    deleteSelectedRows,
    handleChanges,
  };
};

export default usePartiControparti;
