import { useCallback, useEffect, useState } from 'react';
import config from '../../config';
import { authHeader } from '../../utils/auth';
import PageTitle from '../PageTitle';
import ResourceListItem from './ResourceListItem';
import SubTitle from '../SubTitle';
import getLocaleDateString from '../../utils/dateConverter';
import getResourceType from '../../utils/resourceTypeConverter';

const RentalsList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [rentals, setRentals] = useState([]);
  const [rentalDates, setRentalDates] = useState([]);

  const fetchRentals = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/rentals`, { headers: authHeader() });
    if (response.ok) {
      const data = await response.json();
      const transformedData = data.map((rentalData) => {
        return {
          id: rentalData.resource.id,
          title: rentalData.resource.title,
          author: rentalData.author.firstName + ' ' + rentalData.author.lastName,
          startDate: rentalData.startDate,
          rentalStatus: rentalData.rentalStatus,
          type: getResourceType(rentalData.resourceType)
        };
      });
      setRentals(transformedData);
      const dates = transformedData
        .map(data => getLocaleDateString(data.startDate, {}))
        .filter((val, idx, arr) => arr.indexOf(val) === idx)
        .sort((a, b) => b.localeCompare(a));
      setRentalDates(dates);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void fetchRentals();
  }, [fetchRentals]);

  if (rentals.length === 0 && !isLoading) {
    return <h2 className='padded_content'>Nie znaleziono żadnych wypożyczeń.</h2>;
  }

  if (isLoading) {
    return <PageTitle>Ładowanie...</PageTitle>;
  }

  const prolonged = rentals.filter((rental) => rental.rentalStatus === 'PROLONGED');
  const reservedToBorrow = rentals.filter((rental) => rental.rentalStatus === 'RESERVED_TO_BORROW');
  const active = rentals.filter((rental) => rental.rentalStatus === 'ACTIVE');

  return (
    <>
      {prolonged.length > 0 && <>
        <SubTitle>aktualnie przetrzymywane</SubTitle>
        <div className='resources'>
          {prolonged.map((rental) => <ResourceListItem key={rental.id} resource={rental} />)}
        </div>
      </>
      }
      {reservedToBorrow.length > 0 && <>
        <SubTitle>książki czekające na odbiór w bibliotece</SubTitle>
        <div className='resources'>
          {reservedToBorrow.map((rental) => <ResourceListItem key={rental.id} resource={rental} />)}
        </div>
      </>
      }
      {active.length > 0 && <>
        <SubTitle>aktualnie wypożyczone</SubTitle>
        <div className='resources'>
          {active.map((rental) => <ResourceListItem key={rental.id} resource={rental} />)}
        </div>
      </>
      }
      {active.length === 0 && <SubTitle>Nie masz obecnie żadnych wypożyczonych przedmiotów.</SubTitle>}
      {rentals.length > 0 && <SubTitle>historia wypożyczeń</SubTitle>}
      {rentalDates
        .map(date => (
          <>
            <h3 style={{ padding: '0 2rem' }}>wypożyczone w dniu {date}</h3>
            <div className='resources'>
              {rentals
                .filter((rental) => getLocaleDateString(rental.startDate, {}) === date)
                .map((rental) => <ResourceListItem key={rental.id} resource={rental} />)
              }
            </div>
          </>
        ))}
    </>
  );
};


export default RentalsList;
