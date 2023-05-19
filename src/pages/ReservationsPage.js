import PageTitle from '../components/PageTitle';
import ReservationsList from '../components/resource/ReservationsList';

const ReservationsPage = () => {
  return (
    <>
      <PageTitle>Twoje rezerwacje</PageTitle>
      <ReservationsList />
    </>
  );
};

export default ReservationsPage;