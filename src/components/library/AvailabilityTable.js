import './AvailabilityTable.css';
import Button from '../UI/button/Button';
import { useCallback, useEffect, useState } from 'react';
import { authHeader } from '../../utils/auth';
import config from '../../config';

const AvailabilityTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [libraries, setLibraries] = useState([]);

  const fetchLibaries = useCallback(async () => {
      const response = await fetch(`${config.serverBaseUrl}/libraries`, {
        headers: authHeader()
      });

      const data = await response.json();

      const transformedData = data.map((library) => {
        return {
          id: library.libraryId,
          name: library.libraryName,
          address: `ul. ${library.address.streetName} ${library.address.streetNumber}, ${library.address.postcode} ${library.address.city}`
        };
      });

      setLibraries(transformedData);
      setIsLoading(false);
    }, []
  );

  useEffect(() => {
    void fetchLibaries();
  }, [fetchLibaries]);

  return (
    <>
      <h3>dostępność w bibliotekach</h3>
      {isLoading && <h3>Ładowanie...</h3>}
      {!isLoading &&
        <table className='availability_table'>
          <tbody>
          {libraries.map((library) => (
            <tr key={library.id}>
              <th>{library.name}</th>
              <td>{library.address} (TODO)</td>
              <td>TODO sztuki</td>
              <td>
                <div>
                  <Button>Wypożycz</Button>
                  <Button>Rezerwuj</Button>
                </div>
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