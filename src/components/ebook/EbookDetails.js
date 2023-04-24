import PageTitle from '../PageTitle';
import Cover from '../resource/Cover';
import { useParams, useRouteLoaderData } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import '../book/BookDetails.css';
import { authHeader } from '../../utils/auth';
import AvailabilityTable from '../library/AvailabilityTable';
import Button from '../UI/button/Button';

const EbookDetails = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [ebook, setEbook] = useState({});
  const [author, setAuthor] = useState({});
  const [hasInStorage, setHasInStorage] = useState(false);
  const isAuthenticated = useRouteLoaderData('root');

  const fetchEbook = useCallback(async () => {
    const response = await fetch(`http://localhost:8080/ebooks/${params.ebookId}`, {
      headers: authHeader()
    });
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
    const response = await fetch(`http://localhost:8080/resources/authors/${ebook.authorId}`, {
      headers: authHeader()
    });
    const author = await response.json();

    setAuthor(author);
    setIsLoading(false);
  }, [ebook.authorId]);

  const fetchHasInStorage = useCallback(async () => {
    const response = await fetch(`http://localhost:8080/storage/${params.ebookId}`, {
      headers: authHeader()
    });
    const hasInStorage = await response.json();

    setHasInStorage(hasInStorage);
  }, [params.ebookId]);

  useEffect(() => {
    fetchEbook().then(() =>
      fetchAuthor().then(() => {
        if (isAuthenticated)
          void fetchHasInStorage();
      })
    );
  }, [fetchEbook, fetchAuthor, isAuthenticated,fetchHasInStorage]);

  const addToStorageHandler = useCallback(async () => {
    await fetch(`http://localhost:8080/storage/${params.ebookId}`, {
      headers: authHeader(),
      method: 'post'
    });
  }, [params.ebookId]);

  const removeFromStorageHandler = useCallback(async () => {
    await fetch(`http://localhost:8080/storage/${params.ebookId}`, {
      headers: authHeader(),
      method: 'delete'
    });
    setHasInStorage(false);
  }, [params.ebookId]);

  return (
    <>
      {isLoading && <PageTitle>Ładowanie...</PageTitle>}
      {!isLoading &&
        <>
          <div className='title_row'>
            <PageTitle>{ebook.title}</PageTitle>
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
                    <td>{ebook.series}</td>
                  </tr>
                  <tr>
                    <th>data wydania</th>
                    <td>{ebook.releaseDate}</td>
                  </tr>
                  <tr>
                    <th>opis</th>
                    <td>{ebook.description ?? 'brak opisu'}</td>
                  </tr>
                  <tr>
                    <th>format</th>
                    <td>{ebook.format}</td>
                  </tr>
                  <tr>
                    <th>rozmiar (kB)</th>
                    <td>{ebook.size}</td>
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

export default EbookDetails;