import BookListItem from './BookListItem';
import './BooksList.css';

const BooksList = () => {
  const DUMMY_BOOKS = [
    {
      id: 1,
      title: 'Wiedźmin 1',
      author: 'Andrzej Sapkowski'
    },
    {
      id: 2,
      title: 'Wiedźmin 2',
      author: 'Andrzej Sapkowski'
    },
    {
      id: 3,
      title: 'Wiedźmin 3',
      author: 'Andrzej Sapkowski'
    }
  ];

  if (DUMMY_BOOKS.length === 0) {
    return <h2>No books found.</h2>;
  }

  return (
    <div className='books'>
      {DUMMY_BOOKS.map((book) => (
        <BookListItem
          key={book.id}
          id={book.id}
          title={book.title}
          author={book.author}
        />
      ))}
    </div>
  );
};

export default BooksList;