import {useRef} from 'react';

const useModelFactory = (initialModel, factory) => {
    const factoryRef = useRef(factory);
    return {model: factoryRef.current.create(initialModel), metadata: factoryRef.current.metadata};
};

export default useModelFactory;