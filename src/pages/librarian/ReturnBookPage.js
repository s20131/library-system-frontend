import PageTitle from '../../components/PageTitle';
import { useCallback, useEffect, useState } from 'react';
import config from '../../config';
import { authHeader } from '../../utils/auth';
import { toast } from 'react-toastify';
import Button from '../../components/UI/button/Button';
import getLocaleDateString from '../../utils/dateConverter';
import { useNavigate } from 'react-router-dom';

const ReturnBookPage = () => {
    const [isbn, setIsbn] = useState('');
    const [book, setBook] = useState(null);
    const [cardNumber, setCardNumber] = useState('');
    const [user, setUser] = useState(null);
    const [rentalInfo, setRentalInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      if (!isbn) return;
      const debounce = setTimeout(async () => {
        const response = await fetch(`${config.serverBaseUrl}/books/isbn/${isbn}`);
        if (response.ok) {
          const data = await response.json();
          const book = {
            id: data.resource.id,
            title: data.resource.title,
            author: data.author.firstName + ' ' + data.author.lastName
          };
          setBook(book);
        } else {
          setBook(null);
        }
      }, 1000);

      return () => clearTimeout(debounce);
    }, [isbn]);

    useEffect(() => {
      if (!cardNumber) return;
      const debounce = setTimeout(async () => {
        const response = await fetch(`${config.serverBaseUrl}/card/${cardNumber}`, { headers: authHeader() });
        if (response.ok) {
          const data = await response.json();
          setUser({ name: data.firstName + ' ' + data.lastName });
        } else {
          setUser(null);
        }
      }, 500);

      return () => clearTimeout(debounce);
    }, [cardNumber]);

    const handleCheckBeforeBookReturn = useCallback(async (event) => {
      event.preventDefault();
      if (!isbn || !cardNumber) return;
      const library = localStorage.getItem('library');
      const response = await fetch(`${config.serverBaseUrl}/libraries/${library}/librarian/rentals/${isbn}/return?cardNumber=${cardNumber}`, { headers: authHeader() });
      if (response.ok) {
        const rental = await response.json();
        setRentalInfo({
          finish: getLocaleDateString(rental.finish, {}),
          status: rental.status,
          penalty: rental.penalty
        });
      } else if ((await response.json()).code === 'RENTAL_NOT_ACTIVE') {
        toast.error('Brak aktywnego wypożyczenia');
      } else {
        toast.error('Wystąpił błąd w trakcie pobierania informacji o wypożyczeniu książki');
      }
    }, [isbn, cardNumber]);

    const handleBookReturn = useCallback(async (event) => {
      event.preventDefault();
      if (!isbn || !cardNumber) return;
      const library = localStorage.getItem('library');
      const response = await fetch(`${config.serverBaseUrl}/libraries/${library}/librarian/rentals/${isbn}/return?cardNumber=${cardNumber}`, {
        headers: authHeader(),
        method: 'put'
      });
      if (response.ok) {
        toast.success('Pomyślnie zwrócono książkę');
        navigate('/librarian');
      } else {
        toast.error('Wystąpił błąd w trakcie pobierania informacji o wypożyczeniu książki');
      }
    }, [isbn, cardNumber, navigate]);

    const displayInfoMessage = () => {
      switch (rentalInfo.status) {
        case 'ACTIVE':
          if (!rentalInfo.penalty)
            return `wypożyczenie trwa do ${rentalInfo.finish}`;
          else {
            return `wypożyczenie książki jest przedłużone od ${rentalInfo.finish}, naliczona kara wynosi ${(rentalInfo.penalty).toFixed(2)} PLN`;
          }
        case 'RESERVED_TO_BORROW':
          return `książka jest zarezerwowana do ${rentalInfo.finish}`;
        default :
          return 'nie znaleziono aktywnego wypożyczenia';
      }
    };

    const handleIsbnChange = (event) => {
      setIsbn(event.target.value.trim());
    };

    const handleCardNumberChange = (event) => {
      setCardNumber(event.target.value.trim());
    };

    return (
      <>
        <PageTitle>Przeprowadź zwrot książki</PageTitle>
        <div className='wrapper' style={{ marginLeft: '2rem' }}>
          <form onSubmit={handleCheckBeforeBookReturn} className='padded_content login_form'
                style={{ maxWidth: '500px' }}>
            <label htmlFor='card-number'>
              Numer ISBN książki
              <input id='isbn'
                     type='text'
                     name='isbn'
                     onChange={handleIsbnChange}
                     style={{ marginBottom: '1rem' }}
                     required
              />
            </label>
            {book && <p style={{ marginTop: 0, marginBottom: '2rem' }}><i>{book.author} - {book.title}</i></p>}
            <label htmlFor='card-number'>
              Numer karty bibliotecznej czytelnika
              <input id='card-number'
                     type='text'
                     name='card-number'
                     onChange={handleCardNumberChange}
                     style={{ marginBottom: '1rem' }}
                     required
              />
            </label>
            {user && <p style={{ marginTop: 0, marginBottom: '2rem' }}><i>{user.name}</i></p>}
            <Button type='submit'>Sprawdź</Button>
            {rentalInfo && <p style={{ marginLeft: 'auto' }}>{displayInfoMessage()}</p>}
            {rentalInfo && rentalInfo.status === 'ACTIVE' && !rentalInfo.penalty &&
              <Button onClick={handleBookReturn}>Zwróć</Button>}
            {rentalInfo && rentalInfo.status === 'ACTIVE' && rentalInfo.penalty && <Button>Opłać i zwróć</Button>}
            {rentalInfo && rentalInfo.status === 'RESERVED_TO_BORROW' && <Button>Anuluj wypożyczenie</Button>}
          </form>
        </div>
      </>
    );
  }
;

export default ReturnBookPage;