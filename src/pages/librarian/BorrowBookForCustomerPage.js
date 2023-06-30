import PageTitle from '../../components/PageTitle';
import Button from '../../components/UI/button/Button';
import { useCallback, useEffect, useState } from 'react';
import config from '../../config';
import { authHeader } from '../../utils/auth';
import { toast } from 'react-toastify';

const BorrowBookForCustomerPage = () => {
  const [isbn, setIsbn] = useState('');
  const [book, setBook] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
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

  const handleBookRental = useCallback(async (event) => {
    event.preventDefault();
    const library = localStorage.getItem('library');
    const response = await fetch(`${config.serverBaseUrl}/libraries/${library}/librarian/rentals/${isbn}?cardNumber=${cardNumber}`, {
      headers: authHeader(),
      method: 'post'
    });
    if (response.ok) {
      toast.success('Pomyślnie wypożyczono książkę');
    } else {
      toast.error('Wystąpił błąd w trakcie wypożyczania książki');
    }
  }, [isbn, cardNumber]);

  const handleIsbnChange = (event) => {
    setIsbn(event.target.value.trim());
  };

  const handleCardNumberChange = (event) => {
    setCardNumber(event.target.value.trim());
  };

  return (
    <>
      <PageTitle>Wypożyczanie książki czytelnikowi</PageTitle>
      <div className='wrapper' style={{ marginLeft: '2rem' }}>
        <form onSubmit={handleBookRental} className='padded_content login_form' style={{ maxWidth: '500px' }}>
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
          <Button type='submit'>Wypożycz</Button>
        </form>
      </div>
    </>
  );
};

export default BorrowBookForCustomerPage;