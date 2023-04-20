import NavItem from './NavItem';
import { logout } from '../../utils/auth';
import { Link, useRouteLoaderData } from 'react-router-dom';

const NavBar = () => {
  const isAuthenticated = useRouteLoaderData('root');
  return (
    <header>
      <h1>System biblioteczny</h1>
      <nav>
        <ul>
          <NavItem title='Strona główna' path='/' />
          <NavItem title='Książki' path='/books' />
          <NavItem title='E-booki' path='/ebooks' />
          {isAuthenticated &&
            <>
              <NavItem title='Schowek' path='/storage' />
              <NavItem title='Rezerwacje' path='/reservations' />
              <NavItem title='Wypożyczenia' path='/rentals' />
              <NavItem title='Konto' path='/account' />
            </>
          }
          {!isAuthenticated && <NavItem title='Logowanie' path='/auth?mode=login' />}
          {
            //TODO change to a button with action and redirect from /logout?
            isAuthenticated && <Link to='/auth?mode=login' onClick={logout}>Wyloguj</Link>
          }
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;