import { useCallback, useEffect, useState } from 'react';
import { authHeader } from '../../utils/auth';
import PageTitle from '../PageTitle';
import ResourceListItem from './ResourceListItem';

const StoredResourcesList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [resources, setResources] = useState([]);

  const fetchResources = useCallback(async () => {
    const response = await fetch('http://localhost:8080/storage', {
      headers: authHeader()
    });
    const data = await response.json();

    const transformedData = data.map((resourceData) => {
      return {
        id: resourceData.resource.id,
        title: resourceData.resource.title,
        author: resourceData.author.firstName + ' ' + resourceData.author.lastName,
        type: resourceData.resourceType.toLowerCase() + 's' // books, ebooks
      };
    });
    setResources(transformedData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void fetchResources();
  }, [fetchResources]);

  if (resources.length === 0 && !isLoading) {
    return <h2 className='padded_content'>Nie znaleziono żadnych zachowanych zasobów.</h2>;
  }

  return (
    <>
      {isLoading && <PageTitle>Ładowanie...</PageTitle>}
      {!isLoading &&
        <div className='resources'>
          {resources.map((resource) => (
            <ResourceListItem
              key={resource.id}
              id={resource.id}
              title={resource.title}
              author={resource.author}
              resource={resource.type}
            />
          ))}
        </div>
      }
    </>
  );
};

export default StoredResourcesList;