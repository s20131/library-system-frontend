import { useCallback, useEffect, useState } from 'react';
import { authHeader } from '../../utils/auth';
import PageTitle from '../PageTitle';
import ResourceListItem from './ResourceListItem';
import config from '../../config';
import getResourceType from '../../utils/resourceTypeConverter';
import { toast } from 'react-toastify';

const StoredResourcesList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [resources, setResources] = useState([]);

  const fetchResources = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/storage`, { headers: authHeader() });
    if (response.ok) {
      const data = await response.json();
      const transformedData = data.map((resourceData) => {
        return {
          id: resourceData.resource.id,
          title: resourceData.resource.title,
          author: resourceData.author.firstName + ' ' + resourceData.author.lastName,
          type: getResourceType(resourceData.resourceType)
        };
      });
      setResources(transformedData);
    } else {
      toast.error('Wystąpił błąd w trakcie pobierania danych o zachowanych przedmiotach');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void fetchResources();
  }, [fetchResources]);

  if (resources.length === 0 && !isLoading) {
    return <h2 className='padded_content'>Nie znaleziono żadnych zachowanych przedmiotów.</h2>;
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

export default StoredResourcesList;