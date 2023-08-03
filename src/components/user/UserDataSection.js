import { useCallback, useEffect, useState } from 'react';
import config from '../../config';
import { authHeader } from '../../utils/auth';
import PageTitle from '../PageTitle';
import { toast } from 'react-toastify';

const UserDataSection = (props) => {
  const [user, setUser] = useState({});
  const { isLoading, setIsLoading } = props.loadingState;

  const fetchUserData = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/user`, { headers: authHeader() });
    if (response.ok) {
      const user = await response.json();
      setUser({
        name: user.firstName + ' ' + user.lastName,
        email: user.email
      });
    } else {
      toast.error('Wystąpił błąd w trakcie pobierania danych o użytkowniku');
    }
    setIsLoading(false);
  }, [setIsLoading]);

  useEffect(() => {
    void fetchUserData();
  }, [fetchUserData]);

  if (isLoading) {
    return <PageTitle>Ładowanie...</PageTitle>;
  }

  return (
    <div className='padded_content'>
      <div className='padded_content card'>
        <h2 className='h2-title'>cześć, {user.name}!</h2>
        <p>używany adres email: <b>{user.email}</b></p>
      </div>
    </div>
  );
};

export default UserDataSection;