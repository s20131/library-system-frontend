import PageTitle from '../PageTitle';
import Cover from '../resources/Cover';
import DescriptionItem from '../resources/DescriptionItem';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import '../book/BookDetails.css';

const EbookDetails = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [ebook, setEbook] = useState({});
  const [author, setAuthor] = useState({});

  const fetchEbook = useCallback(async () => {
    const response = await fetch(`http://localhost:8080/ebooks/${params.ebookId}`);
    const ebook = await response.json();

    const transformedEbookData = {
      title: ebook.title,
      authorId: ebook.authorId,
      series: ebook.series,
      releaseDate: new Date(ebook.releaseDate[0], ebook.releaseDate[1], ebook.releaseDate[2]).toLocaleDateString(),
      description: ebook.description,
      format: ebook.format,
      size: ebook.size
    };
    setEbook(transformedEbookData);
  }, [params.ebookId]);

  const fetchAuthor = useCallback(async () => {
    if (ebook.authorId === undefined) return;
    const response = await fetch(`http://localhost:8080/resources/authors/${ebook.authorId}`);
    const author = await response.json();

    setAuthor(author);
    setIsLoading(false);
  }, [ebook.authorId]);

  useEffect(() => {
    fetchEbook().then(() =>
      fetchAuthor()
    );
  }, [fetchEbook, fetchAuthor]);

  return (
    <>
      {isLoading && <h2>Ładowanie...</h2>}
      {!isLoading &&
        <>
          <PageTitle title={`${ebook.title}`} />
          <div className='book_details'>
            <Cover context='cover_details' />
            <div className='description_items'>
              <DescriptionItem item='autor' description={author.firstName + ' ' + author.lastName} />
              <DescriptionItem item='seria' description={ebook.series} />
              <DescriptionItem item='data wydania' description={ebook.releaseDate} />
              <DescriptionItem item='opis' description={ebook.description ?? 'brak opisu'} />
              <DescriptionItem item='format' description={ebook.format} />
              <DescriptionItem item='rozmiar (kB)' description={ebook.size} />
            </div>
          </div>
        </>
      }
    </>
  );
};

export default EbookDetails;