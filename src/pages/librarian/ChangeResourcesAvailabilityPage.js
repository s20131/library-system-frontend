import PageTitle from '../../components/PageTitle';
import { useCallback, useEffect, useRef, useState } from 'react';
import config from '../../config';
import { authHeader } from '../../utils/auth';
import { toast } from 'react-toastify';
import Button from '../../components/UI/button/Button';

const ChangeResourcesAvailabilityPage = (props) => {
  const [resources, setResources] = useState([]);
  const resourcesOption = useRef();
  const [availability, setAvailability] = useState();
  const availabilityInput = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const fetchResources = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/${props.resource}`);
    if (response.ok) {
      const data = await response.json();
      const transformedData = data.map((resourceData) => {
        return {
          id: resourceData.resource.id,
          title: resourceData.resource.title,
          author: resourceData.author.firstName + ' ' + resourceData.author.lastName
        };
      });
      setResources(transformedData);
    } else {
      toast.error('Wystąpił błąd w trakcie pobierania danych o dostępnych przedmiotach');
    }
  }, [props.resource]);

  const fetchAvailability = useCallback(async () => {
    const resourceId = resourcesOption.current.value;
    if (!resourceId) return;
    setIsLoading(true);
    const library = localStorage.getItem('library');
    const response = await fetch(`${config.serverBaseUrl}/libraries/${library}/copies/${resourceId}/availability`, { headers: authHeader() });
    if (response.ok) {
      const data = await response.json();
      setAvailability(data);
    } else {
      setAvailability(0);
    }
    setIsLoading(false);
  }, []);

  const handleAvailabilitySave = useCallback(async (event) => {
    event.preventDefault();
    const resourceId = resourcesOption.current.value;
    const availability = availabilityInput.current.value;
    if (!resourceId || !availability) return;
    const library = localStorage.getItem('library');
    const response = await fetch(`${config.serverBaseUrl}/libraries/${library}/copies/${resourceId}/availability?newValue=${availability}`, {
      headers: authHeader(),
      method: 'put'
    });
    if (response.ok) {
      toast.success('Pomyślnie zaktualizowano dostępność przedmiotu');
    } else {
      toast.error('Nie można było zmienić dostępności przedmiotu');
    }
  }, []);

  useEffect(() => {
    void fetchResources();
    void fetchAvailability();
  }, [fetchResources, fetchAvailability]);

  const handleAvailabilityChange = (input) => {
    setAvailability(input.target.value);
  };

  return (
    <>
      <PageTitle>Zmień liczbę dostępności {props.resource === 'books' ? 'książek' : 'e-booków'}</PageTitle>
      <div className='wrapper' style={{ marginLeft: '2rem' }}>
        <form onSubmit={handleAvailabilitySave} className='padded_content login_form' style={{ maxWidth: '500px' }}>
          <label>Wybierz {props.resource === 'books' ? 'książkę' : 'e-booka'}</label>
          <select name='resources'
                  id='resources'
                  ref={resourcesOption}
                  style={{ marginBottom: '1rem' }}
                  onChange={fetchAvailability}
          >
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>{resource.title}, {resource.author}</option>
            ))}
          </select>
          {resources.length > 0 && (
            <>
              <label>Zmień dostępność</label>
              {isLoading && <p>Ładowanie...</p>}
              {!isLoading && (
                <>
                  <input type='number' id='availability' name='availability' min='0'
                         ref={availabilityInput}
                         value={availability}
                         onChange={handleAvailabilityChange}
                  />
                  <Button type='submit'>Zapisz</Button>
                </>
              )}
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default ChangeResourcesAvailabilityPage;