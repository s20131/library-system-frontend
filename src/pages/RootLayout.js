import NavBar from '../components/fragments/NavBar';
import { Outlet } from 'react-router-dom';
import Footer from '../components/fragments/Footer';

const RootLayout = () => {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>)
    ;
};

export default RootLayout;