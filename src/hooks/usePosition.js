import { useEffect, useState } from 'react';

const usePosition = () => {
  const [position, setPosition] = useState({});

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    });
  }, []);

  return position;
};

export default usePosition;