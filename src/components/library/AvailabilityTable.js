import './AvailabilityTable.css';
import Button from '../UI/button/Button';
import { useCallback, useEffect, useState } from 'react';
import { authHeader } from '../../utils/auth';
import config from '../../config';
import usePosition from '../../hooks/usePosition';

const AvailabilityTable = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [libraries, setLibraries] = useState([]);
  const position = usePosition();

  const appendCoordinates = useCallback(() => {
    if (Object.keys(position).length === 2) {
      return `?latitude=${position.latitude}&longitude=${position.longitude}`;
    } else {
      return '';
    }
  }, [position]);

  const fetchLibaries = useCallback(async () => {
      const response = await fetch(`${config.serverBaseUrl}/libraries/copies/${props.resourceId}${appendCoordinates()}`, {
        headers: authHeader()
      });
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

  useEffect(() => {
    void fetchLibaries();
  }, [fetchLibaries]);

  return (
    <>
      <h3>dostępność w bibliotekach</h3>
      {isLoading && <h3>Ładowanie...</h3>}
      {!isLoading && libraries.length !== 0 &&
        <table className='availability_table'>
          <tbody>
          {libraries.map((library) => (
            <tr key={library.id}>
              <th>{library.name}</th>
              {Math.floor(library.distance) === 0 && <td>{library.address}</td>}
              {Math.floor(library.distance) !== 0 && <td>{library.address} ({library.distance} km)</td>}
              <td>{library.available}</td>
              <td>
                {library.available > 0 && <Button>Wypożycz</Button>}
                {library.available === 0 && <Button>Zarezerwuj</Button>}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      }
      {!isLoading && libraries.length === 0 &&
        <h3>Wybrany przedmiot nie jest dostępny w żadnej bibliotece</h3>
      }
    </>
  );
};

export default AvailabilityTable;