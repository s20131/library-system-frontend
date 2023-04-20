import ResourcesList from '../components/resource/ResourcesList';
import PageTitle from '../components/PageTitle';

const ResourcesPage = (props) => {
  const title = props.resource === 'books' ? 'książki' : 'ebooki';
  return (
    <>
      <PageTitle>{`Polecane ${title}`}</PageTitle>
      <ResourcesList resource={props.resource} />
    </>
  );
};

export default ResourcesPage;