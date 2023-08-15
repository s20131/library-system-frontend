import { useEffect, useState } from 'react';
import config from '../config';

const usePosition = () => {
  const [position, setPosition] = useState({});

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    }, async () => {
      const response = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${config.googleApiKey}`, {
        method: 'post'
      });
      const data = await response.json();
      setPosition({
        latitude: data.location.lat,
        longitude: data.location.lng
      });
    });
  }, []);

  return position;
};

export default usePosition;