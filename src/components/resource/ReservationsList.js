import { useCallback, useEffect, useState } from 'react';
import config from '../../config';
import { authHeader } from '../../utils/auth';
import PageTitle from '../PageTitle';
import ResourceListItem from './ResourceListItem';
import SubTitle from '../SubTitle';
import Button from '../UI/button/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReservationsList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState([]);

  const fetchReservations = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/reservations`, { headers: authHeader() });
    const data = await response.json();
    const transformedData = data.map((reservationData) => {
      return {
        id: reservationData.resource.id,
        title: reservationData.resource.title,
        author: reservationData.author.firstName + ' ' + reservationData.author.lastName,
        finishDate: new Date(reservationData.finishDate[0], reservationData.finishDate[1], reservationData.finishDate[2]),
        type: reservationData.resourceType.toLowerCase() + 's'  // books, ebooks
      };
    });
    setReservations(transformedData);
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
    }
  }, []);

  if (reservations.length === 0 && !isLoading) {
    return <h2 className='padded_content'>Nie znaleziono żadnych rezerwacji.</h2>;
  }

  if (isLoading) {
    return <PageTitle>Ładowanie...</PageTitle>;
  }

  const today = new Date();
  const expiringInOneDay = reservations.filter((reservation) => {
    const tmpRes = new Date(reservation.finishDate);
    tmpRes.setDate(tmpRes.getDate() + 1);
    return today.getTime() >= tmpRes.getTime();
  });
  const expiringInOneWeek = reservations.filter((reservation) => {
    const tmpRes = new Date(reservation.finishDate);
    tmpRes.setDate(tmpRes.getDate() + 7);
    return today.getTime() >= tmpRes.getTime();
  });
  const rest = reservations.filter((reservation) => !expiringInOneDay.includes(reservation) || !expiringInOneWeek.includes(reservation));

  return (
    <>
      {expiringInOneDay.length > 0 && (
        <>
          <SubTitle>wygasające w ciągu 1 dnia</SubTitle>
          <div className='resources'>
            {expiringInOneDay.map((reservation) => <ResourceListItem key={reservation.id} resource={reservation} />)}
          </div>
        </>
      )}
      {expiringInOneWeek.length > 0 && (
        <>
          <SubTitle>wygasające w ciągu 1 tygodnia</SubTitle>
          <div className='resources'>
            {expiringInOneWeek.map((reservation) => <ResourceListItem key={reservation.id} resource={reservation} />)}
          </div>
        </>
      )}
      <SubTitle>wygasające w ciągu 1 miesiąca</SubTitle>
      <div className='resources'>
        {rest.map((reservation) =>
          <div>
            <ResourceListItem key={reservation.id} resource={reservation}></ResourceListItem>
            <Button title='Anuluj rezerwację' onClick={() => deleteReservationHandler(reservation.id)}
                    className='cancel_button'>X</Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ReservationsList;