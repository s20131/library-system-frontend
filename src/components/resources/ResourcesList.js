import ResourceListItem from './ResourceListItem';
import './ResourcesList.css';
import { useCallback, useEffect, useState } from 'react';

const ResourcesList = (props) => {
  const [resources, setResources] = useState([]);

  const fetchResources = useCallback(async () => {
    const response = await fetch(`http://localhost:8080/${props.resource}`);
    const data = await response.json();

    const transformedData = data.map((bookData) => {
      return {
        id: bookData.id,
        title: bookData.title,
        author: bookData.author.firstName + ' ' + bookData.author.lastName
      };
    });
    setResources(transformedData);
  }, [resources]);

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