import ResourceListItem from './ResourceListItem';
import './ResourcesList.css';
import { useCallback, useEffect } from 'react';
import PageTitle from '../PageTitle';
import config from '../../config';
import { toast } from 'react-toastify';

const ResourcesList = (props) => {
  const { isLoading, setIsLoading } = props.loadingState;
  const { resources, setResources } = props.resourceState;

  const fetchResources = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/${props.resource}`);
    if (response.ok) {
      const data = await response.json();
      const transformedData = data.map((resourceData) => {
        return {
          id: resourceData.resource.id,
          title: resourceData.resource.title,
          author: resourceData.author.firstName + ' ' + resourceData.author.lastName,
          type: props.resource
        };
      });
      setResources(transformedData);
    } else {
      toast.error('Wystąpił błąd w trakcie pobierania danych o dostępnych przedmiotach');
    }
    setIsLoading(false);
  }, [props.resource, setIsLoading, setResources]);

  useEffect(() => {
    void fetchResources();
  }, [fetchResources]);

  if (resources.length === 0 && !isLoading) {
    return (
      <h2 className='padded_content'>
        Nie znaleziono żadnych {props.resource === 'books' ? 'książek' : 'e-booków'}.
      </h2>
    );
  }

  return (
    <>
      {isLoading && <PageTitle>Ładowanie...</PageTitle>}
      {!isLoading &&
        <div className='resources'>
          {resources.map(resource => <ResourceListItem key={resource.id} resource={resource} />)}
        </div>
      }
    </>
  );
};

export default ResourcesList;