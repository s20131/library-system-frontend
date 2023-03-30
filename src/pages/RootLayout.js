import Navbar from '../components/fragments/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../components/fragments/Footer';

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>)
    ;
};

export default RootLayout;