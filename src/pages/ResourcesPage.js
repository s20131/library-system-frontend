import ResourcesList from '../components/resource/ResourcesList';
import PageTitle from '../components/PageTitle';
import SearchBar from '../components/resource/SearchBar';
import { useCallback, useState } from 'react';
import config from '../config';
import { toast } from 'react-toastify';

const ResourcesPage = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const title = props.resource === 'books' ? 'książki' : 'ebooki';

  const searchHandler = useCallback(async (query) => {
    if (!query || !query.trim()) return;
    setIsLoading(true);
    const response = await fetch(`${config.serverBaseUrl}/${props.resource}?search=${query}`);
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
      toast.error('Wystąpił błąd w trakcie pobierania danych o przedmiotach');
    }
    setIsLoading(false);
  }, [props.resource]);

  return (
    <>
      <PageTitle>{`Polecane ${title}`}</PageTitle>
      <SearchBar searchHandler={searchHandler} />
      <ResourcesList resource={props.resource}
                     resourceState={{ resources, setResources }}
                     loadingState={{ isLoading, setIsLoading }}
      />
    </>
  );
};

export default ResourcesPage;