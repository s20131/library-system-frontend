import { useParams } from 'react-router-dom';
import PageTitle from '../PageTitle';
import Cover from '../resources/Cover';
import DescriptionItem from '../resources/DescriptionItem';

const EbookDetails = () => {
  const params = useParams();
  const DUMMY_EBOOK = {
    title: 'Wiedźmin: Wieża Jaskółki',
    author: 'Andrzej Sapkowski',
    series: 'Wiedźmin',
    releaseDate: new Date(1997, 10, 1),
    description: 'Lorem ipsum dolor...',
    format: 'EPUB',
    size: 42.89
  };

  return (
    <>
      <PageTitle title={`${DUMMY_EBOOK.title} (${params.ebookId})`} />
      <div className='book_details'>
        <Cover context='cover_details' />
        <div className='description_items'>
          <DescriptionItem item='autor' description={DUMMY_EBOOK.author} />
          <DescriptionItem item='seria' description={DUMMY_EBOOK.series} />
          <DescriptionItem item='data wydania' description={DUMMY_EBOOK.releaseDate.toLocaleDateString()} />
          <DescriptionItem item='opis' description={DUMMY_EBOOK.description} />
          <DescriptionItem item='format' description={DUMMY_EBOOK.format} />
          <DescriptionItem item='rozmiar (kB)' description={DUMMY_EBOOK.size} />
        </div>
      </div>
    </>
  );
};

export default EbookDetails;