import { useCallback, useEffect, useState } from 'react';
import config from '../../config';
import { authHeader } from '../../utils/auth';
import PageTitle from '../PageTitle';
import { toast } from 'react-toastify';

const LibraryCardSection = (props) => {
  const [libraryCard, setLibraryCard] = useState({});
  const { isLoading, setIsLoading } = props.loadingState;

  const fetchLibraryCard = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/card`, { headers: authHeader() });
    if (response.ok) {
      const card = await response.json();
      setLibraryCard({
        number: card.cardNumber,
        expiration: card.expiration
      });
    } else {
      toast.error('Wystąpił błąd w trakcie pobierania danych o karcie bibliotecznej');
    }
    setIsLoading(false);
  }, [setIsLoading]);

  useEffect(() => {
    void fetchLibraryCard();
  }, [fetchLibraryCard]);

  if (isLoading) {
    return <PageTitle>Ładowanie...</PageTitle>;
  }

  return (
    <div className='padded_content'>
      <div className='card padded_content'>
        <h2 className='h2-title'>aktywna karta biblioteczna</h2>
        <p>numer: <b>{libraryCard.number}</b></p>
      </div>
    </div>
  );
};

export default LibraryCardSection;