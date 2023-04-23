import ResourcesList from '../components/resource/ResourcesList';
import PageTitle from '../components/PageTitle';
import SearchBar from '../components/resource/SearchBar';

const ResourcesPage = (props) => {
  const title = props.resource === 'books' ? 'książki' : 'ebooki';
  return (
    <>
      <PageTitle>{`Polecane ${title}`}</PageTitle>
      <SearchBar />
      <ResourcesList resource={props.resource} />
    </>
  );
};

export default ResourcesPage;