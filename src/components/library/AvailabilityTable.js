import './AvailabilityTable.css';
import Button from '../UI/button/Button';
import { useCallback, useEffect, useState } from 'react';
import { authHeader } from '../../utils/auth';
import config from '../../config';
import usePosition from '../../hooks/usePosition';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AvailabilityTable = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [libraries, setLibraries] = useState([]);
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [isReservedToBorrow, setIsReservedToBorrow] = useState(false);
  const [rentalMessage, setRentalMessage] = useState('');
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
      setIsLoading(false);
    }, [props.resourceId, appendCoordinates]
  );

  const fetchRentalData = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/rentals/${props.resourceId}`, { headers: authHeader() });
    const data = await response.json();
    const transformedData = {
      rentalStatus: data.rentalStatus,
      finish: new Date(data.finish[0], data.finish[1] - 1, data.finish[2], data.finish[3], data.finish[4]).toLocaleDateString(),
      library: data.library
    };
    // eslint-disable-next-line
    switch (transformedData.rentalStatus) {
      case 'ACTIVE':
        setIsBorrowed(true);
        setRentalMessage(`Wypożyczono z ${transformedData.library}, koniec wypożyczenia w dniu ${transformedData.finish}.`);
        break;
      case 'RESERVED_TO_BORROW':
        setIsReservedToBorrow(true);
        setRentalMessage(`Książka czeka na odbiór w ${transformedData.library} do dnia ${transformedData.finish}.`);
        break;
      case 'PROLONGED':
        setRentalMessage(`Książka jest przetrzymywana od dnia ${transformedData.finish}. Prosimy o jej zwrot do ${transformedData.library}.`);
        break;
    }
  }, [props.resourceId]);

  useEffect(() => {
    void fetchLibaries();
    void fetchRentalData();
  }, [fetchLibaries, fetchRentalData]);

  const borrowResourceHandler = useCallback(async (libraryId) => {
    const response = await fetch(`${config.serverBaseUrl}/libraries/${libraryId}/rentals/${props.resourceId}`, {
      headers: authHeader(),
      method: 'post'
    });
    if (response.ok) {
      setIsBorrowed(true);
      await fetchLibaries();
      toast.success('Pomyślnie wypożyczono. Miłego czytania!', { position: 'top-center' });
    }
  }, [props.resourceId, fetchLibaries]);

  return (
    <>
      {rentalMessage.trim() !== '' && <h3 style={{ color: 'yellow' }}>{rentalMessage}</h3>}
      <h2>dostępność w bibliotekach</h2>
      {isLoading && <h3>Ładowanie...</h3>}
      {!isLoading && libraries.length === 0 && <h2>Wybrany przedmiot nie jest dostępny w żadnej bibliotece</h2>}
      {!isLoading && libraries.length !== 0 &&
        <table className='availability_table'>
          <tbody>
          {libraries.map((library) => (
            <tr key={library.id}>
              <th>{library.name}</th>
              { /*TODO what if library is close to the user*/}
              {Math.floor(library.distance) === 0 && <td>{library.address}</td>}
              {Math.floor(library.distance) !== 0 && <td>{library.address} ({library.distance} km)</td>}
              <td>{library.available}</td>
              <td>
                {library.available > 0 &&
                  <Button onClick={() => borrowResourceHandler(library.id)} disabled={isBorrowed || isReservedToBorrow}>
                    Wypożycz
                  </Button>}
                {library.available === 0 && <Button disabled={isBorrowed || isReservedToBorrow}>Zarezerwuj</Button>}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      }
      <ToastContainer />
    </>
  );
};

export default AvailabilityTable;