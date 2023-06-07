import PageTitle from '../components/PageTitle';
import LibraryCardSection from '../components/user/LibraryCardSection';
import { useState } from 'react';
import UserSettingsSection from '../components/user/UserSettingsSection';
import UserDataSection from '../components/user/UserDataSection';

const AccountPage = () => {
  // TODO shared loader
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <PageTitle>Twoje konto</PageTitle>
      <UserDataSection loadingState={{ isLoading, setIsLoading }} />
      <LibraryCardSection loadingState={{ isLoading, setIsLoading }} />
      <UserSettingsSection loadingState={{ isLoading, setIsLoading }} />
    </>
  );
};

export default AccountPage;