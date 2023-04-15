import NavItem from './NavItem';

const NavBar = () => {
  return (
    <header>
      <h1>System biblioteczny</h1>
      <nav>
        <ul>
          <NavItem title='Książki' path='/books' />
          <NavItem title='E-booki' path='/ebooks' />
          <NavItem title='Schowek' path='/storage' />
          <NavItem title='Rezerwacje' path='/reservations' />
          <NavItem title='Wypożyczenia' path='/rentals' />
          <NavItem title='Konto' path='/account' />
          <NavItem title='Rejestracja' path='/auth?mode=register' />
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;