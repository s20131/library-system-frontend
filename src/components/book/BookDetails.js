import PageTitle from '../PageTitle';
import Cover from '../resource/Cover';
import './BookDetails.css';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouteLoaderData } from 'react-router-dom';
import { authHeader } from '../../utils/auth';
import AvailabilityTable from '../library/AvailabilityTable';
import Button from '../UI/button/Button';
import config from '../../config';
import useFetch from '../../hooks/useFetch';

const BookDetails = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [book, setBook] = useState({});
  const [author, setAuthor] = useState({});
  const [hasInStorage, setHasInStorage] = useState(false);
  const isAuthenticated = useRouteLoaderData('root');

  const fetchBook = useFetch(
    { url: `${config.serverBaseUrl}/books/${params.bookId}` },
    useCallback((data) => {
      const bookData = {
        title: data.title,
        authorId: data.authorId,
        series: data.series,
        releaseDate: new Date(data.releaseDate[0], data.releaseDate[1], data.releaseDate[2]).toLocaleDateString(),
        isbn: data.isbn,
        description: data.description
      };
      setBook(bookData);
    }, [])
  );

  const fetchAuthor = useCallback(async () => {
    if (book.authorId === undefined) return; // TODO
    const response = await fetch(`${config.serverBaseUrl}/resources/authors/${book.authorId}`);
    const author = await response.json();

    setAuthor(author);
    setIsLoading(false);
  }, [book.authorId]);

  const fetchHasInStorage = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/storage/${params.bookId}`, {
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
            {isAuthenticated && <AvailabilityTable />}
          </div>
        </>
      }
    </>
  );
};

export default BookDetails;