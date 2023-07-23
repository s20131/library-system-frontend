import PageTitle from '../../components/PageTitle';
import { useCallback, useEffect, useRef, useState } from 'react';
import config from '../../config';
import { authHeader } from '../../utils/auth';
import { toast } from 'react-toastify';
import Button from '../../components/UI/button/Button';

const ChangeBooksAvailabilityPage = () => {
  const [books, setBooks] = useState([]);
  const bookOption = useRef();
  const [availability, setAvailability] = useState();
  const availabilityInput = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const fetchBooks = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/books`);
    if (response.ok) {
      const data = await response.json();
      const transformedData = data.map((resourceData) => {
        return {
          id: resourceData.resource.id,
          title: resourceData.resource.title,
          author: resourceData.author.firstName + ' ' + resourceData.author.lastName
        };
      });
      setBooks(transformedData);
    }
  }, []);

  const fetchAvailability = useCallback(async () => {
    const book = bookOption.current.value;
    if (!book) return;
    setIsLoading(true);
    const library = localStorage.getItem('library');
    const response = await fetch(`${config.serverBaseUrl}/libraries/${library}/copies/${book}/availability`, { headers: authHeader() });
    if (response.ok) {
      const data = await response.json();
      setAvailability(data);
    } else {
      setAvailability(0);
    }
    setIsLoading(false);
  }, []);

  const handleAvailabilityChange = useCallback(async (event) => {
    event.preventDefault();
    const book = bookOption.current.value;
    const availability = availabilityInput.current.value;
    if (!book || !availability) return;
    const library = localStorage.getItem('library');
    const response = await fetch(`${config.serverBaseUrl}/libraries/${library}/copies/${book}/availability?newValue=${availability}`, {
      headers: authHeader(),
      method: 'put'
    });
    if (!response.ok) {
      toast.error('Nie można było zmienić dostępności');
    }
    toast.success('Pomyślnie zaktualizowano dostępność przedmiotu');
  }, []);

  useEffect(() => {
    void fetchBooks();
    void fetchAvailability();
  }, [fetchBooks, fetchAvailability]);

  // todo set availability after changing
  return (
    <>
      <PageTitle>Zmień liczbę dostępności książek</PageTitle>
      <div className='wrapper' style={{ marginLeft: '2rem' }}>
        <form onSubmit={handleAvailabilityChange} className='padded_content login_form' style={{ maxWidth: '500px' }}>
          <label>Wybierz książkę</label>
          <select name='books'
                  id='books'
                  ref={bookOption}
                  style={{ marginBottom: '1rem' }}
                  onChange={fetchAvailability}
          >
            {books.map((book) => (
              <option key={book.id} value={book.id}>{book.title}, {book.author}</option>
            ))}
          </select>
          {books.length > 0 && (
            <>
              <label>Zmień dostępność</label>
              {isLoading && <p>Ładowanie...</p>}
              {!isLoading && (
                <>
                  <input type='number' id='availability' name='availability' min='0'
                         ref={availabilityInput}
                         defaultValue={availability} />
                  <Button type='submit'>Zapisz</Button>
                </>
              )}
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default ChangeBooksAvailabilityPage;