import { useCallback, useEffect, useState } from 'react';
import config from '../../config';
import { authHeader } from '../../utils/auth';
import PageTitle from '../PageTitle';
import ResourceListItem from './ResourceListItem';
import SubTitle from '../SubTitle';
import Button from '../UI/button/Button';
import { toast } from 'react-toastify';
import getResourceType from '../../utils/resourceTypeConverter';

const ReservationsList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState([]);

  const fetchReservations = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/reservations`, { headers: authHeader() });
    if (response.ok) {
      const data = await response.json();
      const transformedData = data.map((reservationData) => {
        return {
          id: reservationData.resource.id,
          title: reservationData.resource.title,
          author: reservationData.author.firstName + ' ' + reservationData.author.lastName,
          finishDate: new Date(reservationData.finishDate[0], reservationData.finishDate[1] - 1, reservationData.finishDate[2]),
          type: getResourceType(reservationData.resourceType)
        };
      });
      setReservations(transformedData);
    } else {
      toast.error('Wystąpił błąd w trakcie pobierania danych o aktualnych rezerwacjach');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void fetchReservations();
  }, [fetchReservations]);

  const deleteReservationHandler = useCallback(async (resourceId) => {
    const confirmation = window.confirm('Czy na pewno chcesz usunąć rezerwację? Jeśli będziesz chciał ją ponowić, trafisz na koniec kolejki.');
    if (!confirmation) return;
    const response = await fetch(`${config.serverBaseUrl}/reservations/${resourceId}`, {
      headers: authHeader(),
      method: 'delete'
    });
    if (response.ok) {
      toast.success('Pomyślnie anulowano rezerwację.');
      setReservations((prevState) => prevState.filter((reservation) => reservation.id !== resourceId));
    } else {
      toast.error('Wystąpił błąd w trakcie anulowania rezerwacji');
    }
  }, []);

  if (reservations.length === 0 && !isLoading) {
    return <h2 className='padded_content'>Nie znaleziono żadnych rezerwacji.</h2>;
  }

  if (isLoading) {
    return <PageTitle>Ładowanie...</PageTitle>;
  }


  const expiringInOneDay = reservations.filter((r) => {
    const resFinish = new Date(r.finishDate);
    const today = new Date();
    today.setDate(today.getDate() + 1);
    today.setHours(0, 0, 0, 0);
    return today.getTime() >= resFinish.getTime();
  });
  const expiringInOneWeek = reservations.filter((r) => {
    const resFinish = new Date(r.finishDate);
    const today = new Date();
    today.setDate(today.getDate() + 7);
    today.setHours(0, 0, 0, 0);
    return today.getTime() >= resFinish.getTime();
  }).filter((r) => !expiringInOneDay.includes(r));
  const rest = reservations.filter((r) => !expiringInOneDay.includes(r) && !expiringInOneWeek.includes(r));

  return (
    <>
      {expiringInOneDay.length > 0 && (
        <>
          <SubTitle>wygasające w ciągu 1 dnia</SubTitle>
          <div className='resources'>
            {expiringInOneDay.map((reservation) =>
              <div key={reservation.id}>
                <ResourceListItem resource={reservation}></ResourceListItem>
                <Button title='Anuluj rezerwację' onClick={() => deleteReservationHandler(reservation.id)}
                        className='cancel_button'>X</Button>
              </div>
            )}
          </div>
        </>
      )}
      {expiringInOneWeek.length > 0 && (
        <>
          <SubTitle>wygasające w ciągu 1 tygodnia</SubTitle>
          <div className='resources'>
            {expiringInOneWeek.map((reservation) =>
              <div key={reservation.id}>
                <ResourceListItem resource={reservation}></ResourceListItem>
                <Button title='Anuluj rezerwację' onClick={() => deleteReservationHandler(reservation.id)}
                        className='cancel_button'>X</Button>
              </div>
            )}
          </div>
        </>
      )}
      {rest.length > 0 && (
        <>
          <SubTitle>wygasające w ciągu 1 miesiąca</SubTitle>
          <div className='resources'>
            {rest.map((reservation) =>
              <div key={reservation.id}>
                <ResourceListItem resource={reservation}></ResourceListItem>
                <Button title='Anuluj rezerwację' onClick={() => deleteReservationHandler(reservation.id)}
                        className='cancel_button'>X</Button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ReservationsList;