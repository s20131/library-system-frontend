import { useCallback, useEffect, useState } from 'react';
import config from '../../config';
import { authHeader } from '../../utils/auth';
import PageTitle from '../PageTitle';
import './UserSettings.css';

const UserSettingsSection = (props) => {
  const [userSettings, setUserSettings] = useState({});
  const { isLoading, setIsLoading } = props.loadingState;

  const fetchUserSettings = useCallback(async () => {
    const response = await fetch(`${config.serverBaseUrl}/settings`, { headers: authHeader() });
    if (response.ok) {
      const settings = await response.json();
      setUserSettings({
        sendEndOfRentalReminder: settings.sendEndOfRentalReminder,
        sendWhenAvailableReminder: settings.sendWhenAvailableReminder,
        kindleEmail: settings.kindleEmail
      });
    }
    setIsLoading(false);
  }, [setIsLoading]);

  useEffect(() => {
    void fetchUserSettings();
  }, [fetchUserSettings]);

  if (isLoading) {
    return <PageTitle>Ładowanie...</PageTitle>;
  }

  return (
    <div className='padded_content'>
      <div className='card padded_content'>
        <h2 className='h2-title'>ustawienia użytkownika</h2>
        <div>
          <div>
            <label className='label setting'>
              <input type='checkbox' checked={userSettings.sendEndOfRentalReminder} disabled className='checkbox' />
              wysyłaj przypomnienie o końcu wypożyczenia
            </label>
          </div>
          <div>
            <label className='label setting'>
              <input type='checkbox' checked={userSettings.sendWhenAvailableReminder} disabled className='checkbox' />
              wysyłaj przypomnienie, kiedy obserwowana książka jest dostępna
            </label>
          </div>
          <div>
            <label className='label setting'>
              {/* TODO additional T/F property */}
              <input type='checkbox' checked={false} disabled className='checkbox' />
              wysyłaj ebooki prosto na czytnik elektroniczny
              <input id='reader-mail' type='text' name='reader-mail' value={userSettings.kindleEmail ?? ''} placeholder='adres mailowy twojego czytnika' disabled />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsSection;