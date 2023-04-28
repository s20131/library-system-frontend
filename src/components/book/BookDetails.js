import PageTitle from '../PageTitle';
import Cover from '../resource/Cover';
import './BookDetails.css';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouteLoaderData } from 'react-router-dom';
import { authHeader } from '../../utils/auth';
import AvailabilityTable from '../library/AvailabilityTable';
import Button from '../UI/button/Button';
import config from '../../config';

const BookDetails = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [book, setBook] = useState({});
  const [author, setAuthor] = useState({});
  const [hasInStorage, setHasInStorage] = useState(false);
  const isAuthenticated = useRouteLoaderData('root');

  const fetchBook = useCallback(async () => {
    const response = await fetch(`${config.baseUrl}/books/${params.bookId}`, {
      headers: authHeader()
    });
    const book = await response.json();

    const transformedBookData = {
      title: book.title,
      authorId: book.authorId,
      series: book.series,
      releaseDate: new Date(book.releaseDate[0], book.releaseDate[1], book.releaseDate[2]).toLocaleDateString(),
      isbn: book.isbn,
      description: book.description
    };
    setBook(transformedBookData);
  }, [params.bookId]);

  const fetchAuthor = useCallback(async () => {
    if (book.authorId === undefined) return;
    const response = await fetch(`${config.baseUrl}/resources/authors/${book.authorId}`, {
      headers: authHeader()
    });
    const author = await response.json();

    setAuthor(author);
    setIsLoading(false);
  }, [book.authorId]);

  const fetchHasInStorage = useCallback(async () => {
    const response = await fetch(`${config.baseUrl}/storage/${params.bookId}`, {
      headers: authHeader()
    });
    const hasInStorage = await response.json();

    setHasInStorage(hasInStorage);
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
    await fetch(`${config.baseUrl}/storage/${params.bookId}`, {
      headers: authHeader(),
      method: 'post'
    });
    setHasInStorage(true);
  }, [params.bookId]);

  const removeFromStorageHandler = useCallback(async () => {
    await fetch(`${config.baseUrl}/storage/${params.bookId}`, {
      headers: authHeader(),
      method: 'delete'
    });
    setHasInStorage(false);
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
              <Cover context='cover_details' />
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
                    <td>{book.description ?? 'brak opisu'}</td>
                  </tr>
                  <tr>
                    <th>ISBN</th>
                    <td>{book.isbn}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {isAuthenticated && <AvailabilityTable />}
          </div>
        </>
      }
    </>
  );
};

export default BookDetails;