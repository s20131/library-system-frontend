import { useCallback } from 'react';

const useFetch = (requestConfig, applyData) => {
  return useCallback(async () => {
    const response = await fetch(requestConfig.url, {
      method: requestConfig.method ? requestConfig.method : 'get',
      headers: requestConfig.headers ? requestConfig.headers : {},
      body: requestConfig.body ? requestConfig.body : null
    });
    const data = await response.json();

    applyData(data);
  }, [applyData, requestConfig.body, requestConfig.headers, requestConfig.method, requestConfig.url]);
};

export default useFetch;
