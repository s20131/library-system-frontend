import ResourceListItem from './ResourceListItem';
import './ResourcesList.css';
import { useCallback, useEffect, useState } from 'react';

const ResourcesList = (props) => {
  const [resources, setResources] = useState([]);

  const fetchResources = useCallback(async () => {
    const response = await fetch(`http://localhost:8080/${props.resource}`);
    const data = await response.json();

    const transformedData = data.map((resourceData) => {
      return {
        id: resourceData.resource.id,
        title: resourceData.resource.title,
        author: resourceData.author.firstName + ' ' + resourceData.author.lastName
      };
    });
    setResources(transformedData);
  }, [props.resource]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  if (resources.length === 0) {
    return <h2>Nie znaleziono żadnych {props.resource === 'books' ? 'książek' : 'ebooków'}.</h2>;
  }

  return (
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
  );
};

export default ResourcesList;