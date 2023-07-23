import PageTitle from '../../components/PageTitle';
import { Link } from 'react-router-dom';
import './LibrarianPage.css';
import { useCallback, useEffect, useState } from 'react';
import config from '../../config';
import { authHeader } from '../../utils/auth';
import { toast } from 'react-toastify';

const LibrarianPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [libraries, setLibraries] = useState([]);
  const [selectedLibrary, setSelectedLibrary] = useState();

  const fetchLibaries = useCallback(async () => {
      const response = await fetch(`${config.serverBaseUrl}/libraries/librarian`, { headers: authHeader() });
      if (response.ok) {
        const data = await response.json();
        const transformedData = data.map((library) => {
          if (library.isSelected) {
            localStorage.setItem('library', library.libraryId);
            setSelectedLibrary(library.libraryId);
          }
          return {
            id: library.libraryId,
            name: library.libraryName,
            isSelected: library.isSelected
          };
        });
        setLibraries(transformedData);
      }
      setIsLoading(false);
    }, []
  );

  const handleLibrarySelection = useCallback(async (event) => {
    event.preventDefault();
    const libraryId = event.target.value;
    const response = await fetch(`${config.serverBaseUrl}/libraries/${libraryId}/librarian`, {
      headers: authHeader(),
      method: 'put'
    });
    if (response.ok) {
      localStorage.setItem('library', libraryId);
      setSelectedLibrary(libraryId);
      toast.success('Pomyślnie zaktualizowano wybraną bibliotekę');
    } else {
      toast.error('Nie można było wybrać biblioteki');
    }
  }, []);

  useEffect(() => {
    void fetchLibaries();
  }, [fetchLibaries]);

  if (isLoading) {
    return <PageTitle>Ładowanie...</PageTitle>;
  }

  return (
    <>
      <PageTitle>Panel bibliotekarza</PageTitle>
      <div className='padded_content' style={{ display: 'flex' }}>
        <div className='padded_content card' style={{ marginRight: '2rem' }}>
          <h2>Twoje biblioteki</h2>
          <p>wybierz placówkę, z której chcesz dokonywać dalszych czynności:</p>
          <form>
            {libraries.map((library) => (
              <label key={library.id} className='setting'>
                <input type='radio'
                       onChange={handleLibrarySelection}
                       value={library.id}
                       checked={library.id === selectedLibrary}
                       className='checkbox'
                />
                {library.name}
              </label>
            ))}
          </form>
        </div>
        <ul className='padded_content librarian-list card' style={{ marginRight: '2rem' }}>
          <h2>Obsługa klienta</h2>
          <li><h3><Link to='/librarian/rentals'>Wypożycz książkę czytelnikowi</Link></h3></li>
          <li><h3><Link to='/librarian/rentals/complete'>Dokończ proces wypożyczenia</Link></h3></li>
          <li><h3><Link to='/librarian/rentals/return'>Dokonaj zwrotu książki</Link></h3></li>
        </ul>
        <ul className='padded_content librarian-list card' style={{ marginRight: '2rem' }}>
          <h2>Czynności administracyjne</h2>
          <li><h3><Link to='/librarian/resources/availability'>Zmień dostępność zasobu</Link></h3></li>
          <li><h3><Link to='/librarian/resources/add'>Dodaj nowy zasób</Link></h3></li>
        </ul>
      </div>
    </>
  );
};

export default LibrarianPage;