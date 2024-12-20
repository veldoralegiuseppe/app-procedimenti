const getLocalStorage = (storageKey) => {
  const context = localStorage.getItem(storageKey);

  try {
    return JSON.parse(context);
  } catch (error) {
    console.error('Errore nel parsing di localStorage:', error);
    return {};
  }
};

const setLocalStorage = (newContext, storageKey, notify=true) => {
  const currentContext = getLocalStorage(storageKey);
  const updatedContext = { ...(currentContext || {}), ...newContext };

  localStorage.setItem(
    storageKey,
    JSON.stringify(updatedContext)
  );

  if(notify) {
    window.dispatchEvent(new StorageEvent('storage', {
      key: storageKey,
      newValue: JSON.stringify(updatedContext),
    }));
  }
};

const subscribeToLocalStorage = (storageKey, callback) => {
    const storageEventHandler = (event) => {
        if (event.key === storageKey) {
            callback(JSON.parse(event.newValue));
        }
    };

    window.addEventListener('storage', storageEventHandler);

    return () => {
        window.removeEventListener('storage', storageEventHandler);
    };
};

export { getLocalStorage, setLocalStorage, subscribeToLocalStorage };
