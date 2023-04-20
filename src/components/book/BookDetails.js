import PageTitle from '../PageTitle';
import Cover from '../resource/Cover';
import './BookDetails.css';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouteLoaderData } from 'react-router-dom';
import { authHeader } from '../../utils/auth';
import AvailabilityTable from '../library/AvailabilityTable';

const BookDetails = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [book, setBook] = useState({});
  const [author, setAuthor] = useState({});
  const isAuthenticated = useRouteLoaderData('root');

  const fetchBook = useCallback(async () => {
    const response = await fetch(`http://localhost:8080/books/${params.bookId}`, {
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
    const response = await fetch(`http://localhost:8080/resources/authors/${book.authorId}`, {
      headers: authHeader()
    });
    const author = await response.json();

    setAuthor(author);
    setIsLoading(false);
  }, [book.authorId]);

  useEffect(() => {
    fetchBook().then(() =>
      fetchAuthor()
    );
  }, [fetchBook, fetchAuthor]);

  return (
    <>
      {isLoading && <PageTitle>Ładowanie...</PageTitle>}
      {!isLoading &&
        <>
          <PageTitle>{book.title}</PageTitle>
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