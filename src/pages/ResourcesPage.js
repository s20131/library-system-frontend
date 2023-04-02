import ResourcesList from '../components/resources/ResourcesList';
import PageTitle from '../components/PageTitle';

const ResourcesPage = (props) => {
  const title = props.resource === 'books' ? 'książki' : 'ebooki'
  return (
    <>
      <PageTitle title={`Polecane ${title}`} />
      <ResourcesList resource={props.resource} />
    </>
  );
};

export default ResourcesPage;