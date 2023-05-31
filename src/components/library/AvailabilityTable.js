import './AvailabilityTable.css';
import Button from '../UI/button/Button';
import { useCallback, useEffect, useState } from 'react';
import { authHeader } from '../../utils/auth';
import config from '../../config';
import usePosition from '../../hooks/usePosition';
import { toast } from 'react-toastify';
import { Alert } from '@mui/material';

const AvailabilityTable = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [libraries, setLibraries] = useState([]);
  const [hasUserInteractions, setHasUserInteractions] = useState(false);
  const [userInfoMessage, setUserInfoMessage] = useState('');
  const [userWarningMessage, setUserWarningMessage] = useState('');
  const position = usePosition();

  const appendCoordinates = useCallback(() => {
    if (Object.keys(position).length === 2) {
      return `?latitude=${position.latitude}&longitude=${position.longitude}`;
    } else {
      return '';
    }
  }, [position]);

  const fetchLibaries = useCallback(async () => {
      const response = await fetch(`${config.serverBaseUrl}/libraries/copies/${props.resourceId}${appendCoordinates()}`, { headers: authHeader() });
      if (response.ok) {
        const data = await response.json();
        const transformedData = data.map((library) => {
          return {
            id: library.libraryId,
            name: library.libraryName,
            address: `ul. ${library.address.streetName} ${library.address.streetNumber}, ${library.address.postcode} ${library.address.city}`,
            available: library.available,
            distance: (library.distance / 1000).toFixed(2)
          };
        });
        setLibraries(transformedData);
      }
      setIsLoading(false);
    }, [props.resourceId, appendCoordinates]
  );

  const fetchRentalData = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/rentals/${props.resourceId}`, { headers: authHeader() });
    if (response.ok) {
      const data = await response.json();
      const transformedData = {
        rentalStatus: data.rentalStatus,
        finish: new Date(data.finish[0], data.finish[1] - 1, data.finish[2], data.finish[3], data.finish[4]).toLocaleDateString(),
        library: data.library,
        penalty: data.penalty
      };
      // eslint-disable-next-line
      switch (transformedData.rentalStatus) {
        case 'ACTIVE':
          setHasUserInteractions(true);
          setUserInfoMessage(`Wypożyczyłeś ten przedmiot z ${transformedData.library}, koniec wypożyczenia w dniu ${transformedData.finish}.`);
          break;
        case 'RESERVED_TO_BORROW':
          setHasUserInteractions(true);
          setUserInfoMessage(`Ten przedmiot czeka na twój odbiór w ${transformedData.library} do dnia ${transformedData.finish}.`);
          break;
        case 'PROLONGED':
          setHasUserInteractions(true);
          setUserWarningMessage(`Ten przedmiot jest przez ciebie przetrzymywany od dnia ${transformedData.finish}. Prosimy o jego zwrot do ${transformedData.library}. Naliczona kara wynosi obecnie: ${transformedData.penalty.toFixed(2)} zł.`);
          break;
      }
    }
  }, [props.resourceId]);

  const fetchReservationData = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/reservations/${props.resourceId}`, { headers: authHeader() });
    if (response.ok) {
      const data = await response.json();
      const transformedData = {
        finish: new Date(data.finish[0], data.finish[1] - 1, data.finish[2]).toLocaleDateString(),
        library: data.library
      };
      setHasUserInteractions(true);
      setUserInfoMessage(`Ten przedmiot jest dla ciebie zarezerwowany w ${transformedData.library} do dnia ${transformedData.finish}.`);
    }
  }, [props.resourceId]);

  useEffect(() => {
    void fetchLibaries();
    void fetchRentalData();
    void fetchReservationData();
  }, [fetchLibaries, fetchRentalData, fetchReservationData]);

  const borrowResourceHandler = useCallback(async (libraryId) => {
    const response = await fetch(`${config.serverBaseUrl}/libraries/${libraryId}/rentals/${props.resourceId}`, {
      headers: authHeader(),
      method: 'post'
    });
    if (response.ok) {
      setHasUserInteractions(true);
      setLibraries((prevState) => prevState.map((library) => {
        if (library.id === libraryId) {
          library.available--;
        }
        return library;
      }));
      toast.success(`Pomyślnie wypożyczono '${props.title}'. Miłego czytania!`);
    }
  }, [props.resourceId, props.title]);

  const reserveResourceHandler = useCallback(async (libraryId) => {
    const response = await fetch(`${config.serverBaseUrl}/libraries/${libraryId}/reservations/${props.resourceId}`, {
      headers: authHeader(),
      method: 'post'
    });
    if (response.ok) {
      setHasUserInteractions(true);
      toast.success(`Pomyślnie zarezerwowano '${props.title}'. Powiadomimy cię, gdy ten przedmiot znów stanie się dostępny!`);
    }
  }, [props.resourceId, props.title]);

  return (
    <>
      {userInfoMessage.trim() !== '' && <Alert severity='info'>{userInfoMessage}</Alert>}
      {userWarningMessage.trim() !== '' && <Alert severity='warning'>{userWarningMessage}</Alert>}
      <h2>dostępność w bibliotekach</h2>
      {isLoading && <h3>Ładowanie...</h3>}
      {!isLoading && libraries.length === 0 && <h2>Wybrany przedmiot nie jest dostępny w żadnej bibliotece</h2>}
      {!isLoading && libraries.length !== 0 &&
        <table className='availability_table'>
          <tbody>
          {libraries.map((library) => (
            <tr key={library.id}>
              <th>{library.name}</th>
              {/*TODO what if library is close to the user*/}
              {Math.floor(library.distance) === 0 && <td>{library.address}</td>}
              {Math.floor(library.distance) !== 0 && <td>{library.address} ({library.distance} km)</td>}
              <td>{library.available} szt.</td>
              <td>
                {library.available > 0 &&
                  <Button onClick={() => borrowResourceHandler(library.id)}
                          disabled={hasUserInteractions}
                          title={hasUserInteractions === true ? 'Ten przedmiot nie może zostać wypożyczony, ponieważ już go wypożyczasz lub rezerwujesz' : ''}>
                    Wypożycz
                  </Button>}
                {library.available === 0 &&
                  <Button onClick={() => reserveResourceHandler(library.id)}
                          disabled={hasUserInteractions}
                          title={hasUserInteractions === true ? 'Ten przedmiot nie może zostać zarezerwowany, ponieważ już go wypożyczasz lub rezerwujesz' : ''}>
                    Zarezerwuj
                  </Button>}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      }
    </>
  );
};

export default AvailabilityTable;