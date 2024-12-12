import React from 'react';
import { useFetchData } from '@shared/hooks';

const withDataFetch = (WrappedComponent) => ({
  url,
  httpOptions,
  onResult,
  dataProp = 'options',
  fetchFnProp = 'fetchData',
  preload,
  cachePolicy,
  ...props
}) => {
  //console.log('withDataFetch', WrappedComponent, url, httpOptions, onResult, dataProp, props);
  const { data, loading, error, fetchData: fetch } = useFetchData({url, httpOptions, onResult, preload, cachePolicy});

  const fetchData = React.useCallback((arg) => {
    props?.[fetchFnProp]?.(arg);
    fetch();
  }, [props, fetchFnProp, fetch]);

  //console.log('withDataFetch', 'loading', loading, 'data', data);

  return React.createElement(WrappedComponent, { 
    ...props, 
    [dataProp]: data, 
    loading, 
   [fetchFnProp]: fetchData,
  });
};

export default withDataFetch;
