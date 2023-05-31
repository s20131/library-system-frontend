import PageTitle from '../PageTitle';
import Cover from '../resource/Cover';
import { json, useParams, useRouteLoaderData } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import '../book/BookDetails.css';
import { authHeader } from '../../utils/auth';
import AvailabilityTable from '../library/AvailabilityTable';
import Button from '../UI/button/Button';
import config from '../../config';
import { toast } from 'react-toastify';
import getLocaleDateString from '../../utils/dateConverter';

const EbookDetails = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [ebook, setEbook] = useState({});
  const [author, setAuthor] = useState({});
  const [hasInStorage, setHasInStorage] = useState(false);
  const isAuthenticated = useRouteLoaderData('root');

  const fetchEbook = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/ebooks/${params.ebookId}`, { headers: authHeader() });
    if (response.ok) {
      const ebook = await response.json();
      const transformedEbookData = {
        title: ebook.title,
        authorId: ebook.authorId,
        series: ebook.series,
        releaseDate: getLocaleDateString(ebook.releaseDate, 'long'),
        description: ebook.description,
        format: ebook.format,
        size: ebook.size
      };
      setEbook(transformedEbookData);
    } else {
      throw json({ message: 'Podany ebook nie istnieje w bazie' }, { status: 404 });
    }
  }, [params.ebookId]);

  const fetchAuthor = useCallback(async () => {
    if (ebook.authorId === undefined) return;
    const response = await fetch(`${config.serverBaseUrl}/resources/authors/${ebook.authorId}`, { headers: authHeader() });
    if (response.ok) {
      const author = await response.json();
      setAuthor(author);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      throw json({ message: 'Podany autor nie istnieje w bazie' }, { status: 404 });
    }
  }, [ebook.authorId]);

  const fetchHasInStorage = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/storage/${params.ebookId}`, {
      headers: authHeader()
    });
    if (response.ok) {
      const hasInStorage = await response.json();
      setHasInStorage(hasInStorage);
    }
  }, [params.ebookId]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchEbook();
      await fetchAuthor();
      if (isAuthenticated)
        await fetchHasInStorage();
    };
    void fetchData();
  }, [fetchEbook, fetchAuthor, isAuthenticated, fetchHasInStorage]);

  const addToStorageHandler = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/storage/${params.ebookId}`, {
      headers: authHeader(),
      method: 'post'
    });
    if (response.ok) {
      setHasInStorage(true);
      toast.success('Pomyślnie dodano do schowka.');
    }
  }, [params.ebookId]);

  const removeFromStorageHandler = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/storage/${params.ebookId}`, {
      headers: authHeader(),
      method: 'delete'
    });
    if (response.ok) {
      setHasInStorage(false);
      toast.success('Pomyślnie usunięto ze schowka.');
    }
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
              <Cover context='cover_details' resourceId={params.ebookId} />
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
                    <td>{ebook.description ?? <i>brak opisu</i>}</td>
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
            {isAuthenticated && <AvailabilityTable resourceId={params.ebookId} title={ebook.title} />}
          </div>
        </>
      }
    </>
  );
};

export default EbookDetails;