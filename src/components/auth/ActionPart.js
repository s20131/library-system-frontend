import { Link } from 'react-router-dom';
import Button from '../UI/button/Button';
import './ActionPart.css';

const ActionPart = (props) => {
  if (props.mode === 'login') {
    return (
      <div className='actions'>
        <p>Nie masz jeszcze konta?&nbsp;
          <Link type='button' to='?mode=register'>Zarejestruj się</Link>
        </p>
        <Button type='submit'>Zaloguj się</Button>
      </div>
    );
  } else {
    return (
      <div className='actions'>
        <p>Masz już konto?&nbsp;
          <Link type='button' to='?mode=login'>Zaloguj się</Link>
        </p>
        <Button type='submit'>Zarejestruj się</Button>
      </div>
    );
  }
};

export default ActionPart;