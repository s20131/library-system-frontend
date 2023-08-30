import { useCallback, useEffect, useRef, useState } from 'react';
import config from '../../config';
import { toast } from 'react-toastify';
import { authHeader } from '../../utils/auth';
import { json, redirect } from 'react-router-dom';
import PageTitle from '../../components/PageTitle';
import HorizontalLine from '../../components/UI/HorizontalLine';
import Button from '../../components/UI/button/Button';

const AddNewEbookPage = () => {
  const titleInput = useRef();
  const [seriesChecked, setSeriesChecked] = useState(true);
  const seriesCheckedRef = useRef();
  const seriesInput = useRef();
  const seriesListOption = useRef();
  const [authorChecked, setAuthorChecked] = useState(false);
  const authorCheckedRef = useRef();
  const authorFirstNameInput = useRef();
  const authorLastNameInput = useRef();
  const authorListOption = useRef();
  const releaseDateInput = useRef();
  const descriptionInput = useRef();
  const contentRef = useRef();
  const coverRef = useRef();

  const [series, setSeries] = useState([]);
  const [authors, setAuthors] = useState([]);
  const toastId = useRef(null);

  const fetchSeries = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/resources/series`);
    if (response.ok) {
      const data = await response.json();
      const transformedData = data.map((seriesData) => {
        return {
          series: seriesData
        };
      });
      setSeries(transformedData.sort((a, b) => a.series > b.series ? 1 : -1));
    } else {
      toast.error('Wystąpił błąd w trakcie pobierania danych o dostępnych seriach');
    }
  }, []);

  const fetchAuthors = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/resources/authors`);
    if (response.ok) {
      const data = await response.json();
      const transformedData = data.map((authorData) => {
        return {
          id: authorData.authorId,
          firstName: authorData.firstName,
          lastName: authorData.lastName
        };
      });
      setAuthors(transformedData.sort((a, b) => a.lastName > b.lastName ? 1 : -1));
    } else {
      toast.error('Wystąpił błąd w trakcie pobierania danych o dostępnych autorach');
    }
  }, []);

  useEffect(() => {
    void fetchSeries();
    void fetchAuthors();
  }, [fetchSeries, fetchAuthors]);

  const addAuthor = useCallback(async (author) => {
    const response = await fetch(`${config.serverBaseUrl}/resources/authors`, {
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
      method: 'post',
      body: JSON.stringify(author)
    });
    if (response.ok) {
      return await response.json();
    }
    showError('autora');
    throw json({ message: 'Could not create author' }, { status: 400 });
  }, []);

  const addEbook = useCallback(async (ebook) => {
    const body = {
      title: ebook.title,
      authorId: ebook.authorId,
      releaseDate: ebook.releaseDate,
      description: ebook.description,
      series: ebook.series
    };
    const blobBody = new Blob([JSON.stringify(body)], { type: 'application/json' });
    const form = new FormData();
    form.append('addEbookRequest', blobBody);
    form.append('content', contentRef.current.files[0]);
    const response = await fetch(`${config.serverBaseUrl}/ebooks`, {
      headers: { ...authHeader() },
      method: 'post',
      body: form
    });
    if (response.ok) {
      return await response.json();
    }
    showError('e-booka');
    throw json({ message: 'Could not create e-ebook' }, { status: 400 });
  }, []);

  const addCover = useCallback(async (ebookId, cover) => {
    const bytes = await cover.arrayBuffer();
    const contentType = cover.type;
    const response = await fetch(`${config.serverBaseUrl}/resources/${ebookId}/cover`, {
      headers: { ...authHeader(), 'Content-Type': contentType },
      method: 'post',
      body: bytes
    });
    if (!response.ok) {
      showWarning();
    }
  }, []);

  const addSeries = useCallback(async (series) => {
    const response = await fetch(`${config.serverBaseUrl}/resources/series`, {
      headers: authHeader(),
      method: 'post',
      body: series
    });
    if (!response.ok) {
      showError('serii');
      throw json({ message: 'Could not create series' }, { status: 400 });
    }
  }, []);

  const handleEbookCreation = useCallback(async (event) => {
    event.preventDefault();
    toastId.current = toast.loading('Zapisywanie e-booka w bazie danych...');
    const seriesChecked = seriesCheckedRef.current.checked;
    if (seriesChecked && seriesInput.current.value && !series.includes(seriesInput.current.value)) {
      await addSeries(seriesInput.current.value);
    }

    let authorId;
    const authorChecked = authorCheckedRef.current.checked;
    if (authorChecked) {
      authorId = await addAuthor({
        firstName: authorFirstNameInput.current.value,
        lastName: authorLastNameInput.current.value
      });
    } else {
      authorId = authorListOption.current.value;
    }

    const ebook = {
      title: titleInput.current.value,
      authorId: authorId,
      releaseDate: releaseDateInput.current.value,
      description: descriptionInput.current.value ? descriptionInput.current.value : null,
      series: seriesChecked
        ? (seriesInput.current.value ? seriesInput.current.value : null)
        : seriesListOption.current.value,
      content: contentRef.current.files[0]
    };

    const ebookId = await addEbook(ebook);
    const cover = coverRef.current.files[0];
    if (cover) {
      await addCover(ebookId, cover);
    }
    toast.update(toastId.current, {
      render: 'Pomyślnie zapisano e-booka w bazie danych. ' +
        'Aby był widoczny w publicznym katalogu, należy poczekać na akceptację administratora.',
      type: 'success',
      isLoading: false,
      autoClose: 5000
    });
    // TODO doesn't work
    return redirect('/librarian');
  }, [addAuthor, addEbook, addCover, addSeries, series]);

  const showError = (item) => {
    toast.update(toastId.current, {
      render: `Wystąpił błąd w trakcie dodawania ${item} do systemu`,
      type: 'error',
      isLoading: false,
      autoClose: 5000
    });
  };

  const showWarning = () => {
    toast.update(toastId.current, {
      render: 'Wystąpił błąd w trakcie zapisywania okładki, ale dane e-booka zostały zapisane poprawnie',
      type: 'warning',
      isLoading: false,
      autoClose: 5000
    });
  };

  return (
    <>
      <PageTitle>Dodaj e-booka</PageTitle>
      <div className='wrapper' style={{ marginLeft: '2rem' }}>
        <form onSubmit={handleEbookCreation} className='padded_content login_form' style={{ maxWidth: '500px' }}>

          <label htmlFor='title'>
            Tytuł*
            <input id='title'
                   type='text'
                   name='title'
                   style={{ marginBottom: '1rem' }}
                   ref={titleInput}
                   required
            />
          </label>
          <HorizontalLine />
          <label className='setting'>
            <input type='checkbox'
                   value='series-option'
                   className='checkbox'
                   name='series-option'
                   checked={seriesChecked}
                   onChange={() => setSeriesChecked(!seriesChecked)}
                   ref={seriesCheckedRef}
                   style={{ width: '10%', marginLeft: 'auto', marginBottom: 'auto' }}
            />
            nowa seria
          </label>
          <label htmlFor='series'>
            Seria
            <input id='series'
                   type='text'
                   name='series'
                   style={{ marginBottom: '1rem' }}
                   ref={seriesInput}
                   disabled={!seriesChecked}
            />
          </label>
          <label className='login_form'>
            Wybierz serię
            <select name='series-list'
                    id='series-list'
                    style={{ marginBottom: '1rem' }}
                    ref={seriesListOption}
                    disabled={seriesChecked}
            >
              {series.map((item) => (
                <option key={item.series} value={item.series}>{item.series}</option>
              ))}
            </select>
          </label>
          <HorizontalLine />
          <label className='setting'>
            <input type='checkbox'
                   value='author-option'
                   className='checkbox'
                   name='author-option'
                   style={{ width: '10%', marginLeft: 'auto', marginBottom: 'auto' }}
                   checked={authorChecked}
                   onChange={() => setAuthorChecked(!authorChecked)}
                   ref={authorCheckedRef}
            />
            nowy autor
          </label>
          <label htmlFor='author-name'>
            Imię autora{authorChecked && '*'}
            <input id='author-name'
                   type='text'
                   name='author-name'
                   style={{ marginBottom: '1rem' }}
                   ref={authorFirstNameInput}
                   required={authorChecked}
                   disabled={!authorChecked}
            />
          </label>
          <label htmlFor='author-surname'>
            Nazwisko autora{authorChecked && '*'}
            <input id='author-surname'
                   type='text'
                   name='author-surname'
                   style={{ marginBottom: '1rem' }}
                   ref={authorLastNameInput}
                   required={authorChecked}
                   disabled={!authorChecked}
            />
          </label>
          <label className='login_form'>
            Wybierz autora{!authorChecked && '*'}
            <select name='series-list'
                    id='series-list'
                    style={{ marginBottom: '1rem' }}
                    ref={authorListOption}
                    required={!authorChecked}
                    disabled={authorChecked}
            >
              {authors.map((item) => (
                <option key={item.id} value={item.id}>{item.lastName}, {item.firstName}</option>
              ))}
            </select>
          </label>
          <HorizontalLine />
          <label htmlFor='release-date'>
            Data wydania*
            <input id='release-date'
                   type='date'
                   name='release-date'
                   style={{ marginBottom: '1rem' }}
                   required
                   ref={releaseDateInput}
            />
          </label>
          <label htmlFor='description'>
            Opis
            <input id='description'
                   type='text'
                   name='description'
                   style={{ marginBottom: '1rem' }}
                   ref={descriptionInput}
            />
          </label>
          <label htmlFor='isbn'>
            Plik z e-bookiem*
            <input id='content'
                   type='file'
                   name='content'
                   accept='application/pdf,application/epub+zip'
                   style={{ marginBottom: '1rem', backgroundColor: '#499147', border: 'initial' }}
                   required
                   ref={contentRef}
            />
          </label>
          <label htmlFor='cover'>
            Okładka
            <input id='cover'
                   type='file'
                   name='cover'
                   accept='image/jpeg,image/png,image/webp'
                   style={{ marginBottom: '1rem', backgroundColor: '#499147', border: 'initial' }}
                   ref={coverRef}
            />
          </label>
          <Button type='submit'>Zapisz</Button>
        </form>
        <p><i>* - pole wymagane</i></p>
      </div>
    </>
  );
};

export default AddNewEbookPage;