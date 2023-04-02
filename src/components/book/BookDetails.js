import { useParams } from 'react-router-dom';
import PageTitle from '../PageTitle';
import Cover from '../resources/Cover';
import DescriptionItem from '../resources/DescriptionItem';
import './BookDetails.css';

const BookDetails = () => {
  const params = useParams();
  const DUMMY_BOOK = {
    title: 'Wiedźmin: Wieża Jaskółki',
    author: 'Andrzej Sapkowski',
    series: 'Wiedźmin',
    releaseDate: new Date(1997, 10, 1),
    description: 'Lorem ipsum dolor...'
  };

  return (
    <>
      <PageTitle title={`${DUMMY_BOOK.title} (${params.bookId})`} />
      <div className='book_details'>
        <Cover context='cover_details' />
        <div className='description_items'>
          <DescriptionItem item={listItems.author} description={DUMMY_BOOK.author} />
          <DescriptionItem item={listItems.series} description={DUMMY_BOOK.series} />
          <DescriptionItem item={listItems.releaseDate} description={DUMMY_BOOK.releaseDate.toLocaleDateString()} />
          <DescriptionItem item={listItems.description} description={DUMMY_BOOK.description} />
        </div>
      </div>
    </>
  );
};

const listItems = {
  author: 'autor',
  series: 'seria',
  releaseDate: 'data wydania',
  description: 'opis'
};

export default BookDetails;