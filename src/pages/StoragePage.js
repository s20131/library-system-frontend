import PageTitle from '../components/PageTitle';
import StoredResourcesList from '../components/resource/StoredResourcesList';

const StoragePage = () => {
  return (
    <>
      <PageTitle>Twój schowek</PageTitle>
      <StoredResourcesList />
    </>
  );
};

export default StoragePage;