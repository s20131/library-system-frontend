import PageTitle from '../PageTitle';
import Cover from '../resources/Cover';
import DescriptionItem from '../resources/DescriptionItem';
import './BookDetails.css';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BookDetails = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [book, setBook] = useState({});
  const [author, setAuthor] = useState({});

  const fetchBook = useCallback(async () => {
    const response = await fetch(`http://localhost:8080/books/${params.bookId}`);
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
    const response = await fetch(`http://localhost:8080/resources/authors/${book.authorId}`);
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
      {isLoading && <h2>Ładowanie...</h2>}
      {!isLoading &&
        <>
          <PageTitle title={book.title} />
          <div className='book_details'>
            <Cover context='cover_details' />
            <div className='description_items'>
              <DescriptionItem item='autor' description={author.firstName + ' ' + author.lastName} />
              <DescriptionItem item='seria' description={book.series} />
              <DescriptionItem item='data wydania' description={book.releaseDate} />
              <DescriptionItem item='opis' description={book.description ?? 'brak opisu'} />
              <DescriptionItem item='ISBN' description={book.isbn} />
            </div>
          </div>
        </>
      }
    </>
  );
};

export default BookDetails;