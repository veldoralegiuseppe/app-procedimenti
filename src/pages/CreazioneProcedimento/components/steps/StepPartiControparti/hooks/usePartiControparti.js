import { useCallback, useRef, useState } from 'react';
import { ModeTypes, FieldTypes } from '@shared/metadata';
import { useStoreContext } from '@shared/context';
import { usePersoneStore, usePersonaStore } from '@features/persona';

const usePartiControparti = () => {
  const [open, setOpen] = useState(false);
  const modeRef = useRef(ModeTypes.CREATE);

  const selectedRowIndicesRef = useRef([]);
  const [selectedRowIndices, setSelectedRowIndices] = useState([]);

  const personeStore = useStoreContext(FieldTypes.PERSONE);
  const storePersonaFisica = useStoreContext(FieldTypes.PERSONA_FISICA);
  const storePersonaGiuridica = useStoreContext(FieldTypes.PERSONA_GIURIDICA);
  const { resetModel: resetPersonaFisica } = usePersonaStore(storePersonaFisica);
  const { resetModel: resetPersonaGiuridica } = usePersonaStore(storePersonaGiuridica);
  const { removeItem, getItem, updateItem, addItem } = usePersoneStore(personeStore);

  const handleOpenCreation = useCallback(() => {
    modeRef.current = ModeTypes.CREATE;
    resetPersonaFisica();
    resetPersonaGiuridica();
    setOpen(true);
  }, [resetPersonaFisica, resetPersonaGiuridica]);

  const handleOpenModify = useCallback(() => {
    modeRef.current = ModeTypes.EDIT;

    const personaSelezionata = getItem(selectedRowIndices[0]);
    const tipoPersona = personaSelezionata.type;
    tipoPersona === FieldTypes.PERSONA_FISICA
      ? resetPersonaFisica(personaSelezionata)
      : resetPersonaGiuridica(personaSelezionata);
    setOpen(true);
  }, [selectedRowIndices, getItem, resetPersonaFisica, resetPersonaGiuridica]);

  const handleClose = useCallback(() => {
    setOpen(false);
    resetPersonaFisica();
    resetPersonaGiuridica();
  }, [resetPersonaFisica, resetPersonaGiuridica]);

  const handleRowSelected = useCallback((indices) => {
    selectedRowIndicesRef.current = indices;
    setSelectedRowIndices([...indices]);
  }, []);

  const handleDelete = useCallback(() => {
    selectedRowIndices.forEach((index) => {
      removeItem(index);
    });
    setSelectedRowIndices([]);
    selectedRowIndicesRef.current = [];
  }, [selectedRowIndices, removeItem]);

  const handleChanges = useCallback(
    (newPersona) => {
      switch (modeRef.current) {
        case ModeTypes.CREATE:
          addItem(newPersona);
          break;
        case ModeTypes.EDIT:
          const index = selectedRowIndicesRef.current[0];
          updateItem(index, newPersona);
          break;
        default:
          break;
      }
    },
    [addItem, updateItem]
  );

  return {
    open,
    selectedRowIndices,
    handleOpenCreation,
    handleOpenModify,
    handleClose,
    handleRowSelected,
    handleDelete,
    handleChanges,
  };
}

export default usePartiControparti;
