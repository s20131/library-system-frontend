import NavItem from './NavItem';

const Navbar = () => {
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
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;