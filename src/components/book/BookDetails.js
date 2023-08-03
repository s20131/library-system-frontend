import PageTitle from '../PageTitle';
import Cover from '../resource/Cover';
import './BookDetails.css';
import { useCallback, useEffect, useState } from 'react';
import { json, useParams, useRouteLoaderData } from 'react-router-dom';
import { authHeader } from '../../utils/auth';
import AvailabilityTable from '../library/AvailabilityTable';
import Button from '../UI/button/Button';
import config from '../../config';
import { toast } from 'react-toastify';
import getLocaleDateString from '../../utils/dateConverter';

const BookDetails = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [book, setBook] = useState({});
  const [author, setAuthor] = useState({});
  const [hasInStorage, setHasInStorage] = useState(false);
  const { auth: isAuthenticated } = useRouteLoaderData('root');

  const fetchBook = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/books/${params.bookId}`);
    if (response.ok) {
      const book = await response.json()
      const bookData = {
        title: book.title,
        authorId: book.authorId,
        series: book.series,
        releaseDate: getLocaleDateString(book.releaseDate, { day: 'numeric', month: 'long' }),
        isbn: book.isbn,
        description: book.description
      };
      setBook(bookData);
    } else {
      toast.error('Wystąpił błąd w trakcie pobierania danych o książce');
    }
  }, [params.bookId]);

  const fetchAuthor = useCallback(async () => {
    if (book.authorId === undefined) return;
    const response = await fetch(`${config.serverBaseUrl}/resources/authors/${book.authorId}`);
    if (response.ok) {
      const author = await response.json();
      setAuthor(author);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      toast.error('Wystąpił błąd w trakcie pobierania danych o autorze');
      throw json({ message: 'Podany autor nie istnieje w bazie' }, { status: 404 });
    }
  }, [book.authorId]);

  const fetchHasInStorage = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/storage/${params.bookId}`, { headers: authHeader() });
    if (response.ok) {
      const hasInStorage = await response.json();
      setHasInStorage(hasInStorage);
    }
  }, [params.bookId]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchBook();
      await fetchAuthor();
      if (isAuthenticated)
        await fetchHasInStorage();
    };
    void fetchData();
  }, [fetchBook, fetchAuthor, isAuthenticated, fetchHasInStorage]);

  const addToStorageHandler = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/storage/${params.bookId}`, {
      headers: authHeader(),
      method: 'post'
    });
    if (response.ok) {
      setHasInStorage(true);
      toast.success('Pomyślnie dodano do schowka.');
    } else {
      toast.error('Wystąpił błąd w trakcie dodawania książki do schowka');
    }
  }, [params.bookId]);

  const removeFromStorageHandler = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/storage/${params.bookId}`, {
      headers: authHeader(),
      method: 'delete'
    });
    if (response.ok) {
      setHasInStorage(false);
      toast.success('Pomyślnie usunięto ze schowka.');
    } else {
      toast.error('Wystąpił błąd w trakcie usuwania książki ze schowka');
    }
  }, [params.bookId]);

  return (
    <>
      {isLoading && <PageTitle>Ładowanie...</PageTitle>}
      {!isLoading &&
        <>
          <div className='title_row'>
            <PageTitle>{book.title}</PageTitle>
            {isAuthenticated && !hasInStorage && <Button onClick={addToStorageHandler}>Dodaj do schowka</Button>}
            {isAuthenticated && hasInStorage && <Button onClick={removeFromStorageHandler}>Usuń ze schowka</Button>}
          </div>
          <div className='padded_content'>
            <div className='book_details'>
              <Cover context='cover_details' resourceId={params.bookId} title={book.title} />
              <div className='table_container'>
                <table className='description_table'>
                  <tbody>
                  <tr>
                    <th>autor</th>
                    <td>{author.firstName + ' ' + author.lastName}</td>
                  </tr>
                  <tr>
                    <th>seria</th>
                    <td>{book.series}</td>
                  </tr>
                  <tr>
                    <th>data wydania</th>
                    <td>{book.releaseDate}</td>
                  </tr>
                  <tr>
                    <th>opis</th>
                    <td>{book.description ?? <i>brak opisu</i>}</td>
                  </tr>
                  <tr>
                    <th>ISBN</th>
                    <td>{book.isbn}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {isAuthenticated && <AvailabilityTable resourceId={params.bookId} title={book.title} resourceType='book' />}
          </div>
        </>
      }
    </>
  );
};

export default BookDetails;