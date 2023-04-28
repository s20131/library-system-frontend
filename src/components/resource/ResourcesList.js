import ResourceListItem from './ResourceListItem';
import './ResourcesList.css';
import { useCallback, useEffect, useState } from 'react';
import { authHeader } from '../../utils/auth';
import PageTitle from '../PageTitle';
import config from '../../config';

const ResourcesList = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [resources, setResources] = useState([]);

  const fetchResources = useCallback(async () => {
    const response = await fetch(`${config.baseUrl}/${props.resource}`, {
      headers: authHeader()
    });
    const data = await response.json();

    const transformedData = data.map((resourceData) => {
      return {
        id: resourceData.resource.id,
        title: resourceData.resource.title,
        author: resourceData.author.firstName + ' ' + resourceData.author.lastName
      };
    });
    setResources(transformedData);
    setIsLoading(false);
  }, [props.resource]);

  useEffect(() => {
    void fetchResources();
  }, [fetchResources]);

  if (resources.length === 0 && !isLoading) {
    return <h2 className='padded_content'>Nie znaleziono żadnych {props.resource === 'books' ? 'książek' : 'ebooków'}.</h2>;
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
              resource={props.resource}
            />
          ))}
        </div>
      }
    </>
  );
};

export default ResourcesList;