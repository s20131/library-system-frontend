import NavBar from '../components/fragments/NavBar';
import Footer from '../components/fragments/Footer';
import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError()
  console.log(error)
  return (
    <>
      <NavBar />
      <main>
        <h1>{error.status}</h1>
        <p>{(error.data && error.data.message) || 'Wystąpił nieznany błąd'}</p>
      </main>
      <Footer />
    </>
  );
};

export default ErrorPage;