import BooksList from '../components/book/BooksList';
import PageTitle from './PageTitle';

const BooksPage = () => {
  return (
    <>
      <PageTitle title='Polecane książki' />
      <BooksList />
    </>
  );
};

export default BooksPage;