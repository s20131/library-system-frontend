import PageTitle from '../../components/PageTitle';
import Button from '../../components/UI/button/Button';
import config from '../../config';
import { authHeader } from '../../utils/auth';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';

const CompleteBookRentalPage = () => {
  const [awaitingBooks, setAwaitingBooks] = useState([]);
  const cardNumberInput = useRef();
  const awaitingBookOption = useRef();

  const handleCardNumberSubmit = useCallback(async (event) => {
    event.preventDefault();
    const library = localStorage.getItem('library');
    const cardNumber = cardNumberInput.current.value;
    const response = await fetch(`${config.serverBaseUrl}/libraries/${library}/librarian/rentals?cardNumber=${cardNumber}`, { headers: authHeader() });
    if (response.ok) {
      const books = await response.json();
      const transformedBooks = books.map((book) => {
        return {
          id: book.id,
          title: book.title,
          isbn: book.isbn
        };
      });
      if (transformedBooks.length === 0) {
        toast.info('Brak książek do wypożyczenia z wybranej biblioteki');
      }
      setAwaitingBooks(transformedBooks);
    } else {
      toast.error('Podana karta nie istnieje lub jest nieaktywna');
    }
  }, []);

  const handleCompletionOfBookRental = useCallback(async (event) => {
    event.preventDefault();
    const library = localStorage.getItem('library');
    const bookIsbn = awaitingBookOption.current.value;
    const cardNumber = cardNumberInput.current.value;
    const response = await fetch(`${config.serverBaseUrl}/libraries/${library}/librarian/rentals/${bookIsbn}/status?cardNumber=${cardNumber}&statusStrategy=START`, {
      headers: authHeader(),
      method: 'put'
    });
    if (response.ok) {
      setAwaitingBooks((prevState) => prevState.filter((book) => book.isbn !== bookIsbn));
      toast.success('Pomyślnie wypożyczono książkę');
    } else {
      toast.error('Wystąpił błąd w trakcie wypożyczania książki');
    }
  }, []);

  return (
    <>
      <PageTitle>Dokończ proces wypożyczenia</PageTitle>
      <div className='wrapper' style={{ marginLeft: '2rem' }}>
        <form onSubmit={handleCardNumberSubmit} className='padded_content login_form' style={{ maxWidth: '500px' }}>
          <label htmlFor='card-number'>
            Numer karty bibliotecznej czytelnika
            <input id='card-number'
                   type='text'
                   name='card-number'
                   ref={cardNumberInput}
                   style={{ marginBottom: '1rem' }}
                   required
            />
          </label>
          <Button type='submit'>Znajdź</Button>
        </form>
        {awaitingBooks.length > 0 && (
          <form onSubmit={handleCompletionOfBookRental}
                className='padded_content login_form'
                style={{ marginTop: '2rem' }}
          >
            <label>Wybierz książkę do wypożyczenia</label>
            <select name='awaiting-books'
                    id='awaiting-books'
                    ref={awaitingBookOption}
                    style={{ marginBottom: '1rem' }}
            >
              {awaitingBooks.map((awaitingBook) => (
                <option key={awaitingBook.id} value={awaitingBook.isbn}>{awaitingBook.title}</option>
              ))}
            </select>
            <Button type='submit'>Wypożycz</Button>
          </form>
        )}
      </div>
    </>
  );
};

export default CompleteBookRentalPage;