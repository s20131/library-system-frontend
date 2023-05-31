import NavBar from '../components/fragments/NavBar';
import Footer from '../components/fragments/Footer';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  let errorMessage = <h1>Wystąpił nieznany błąd</h1>;
  if (isRouteErrorResponse(error)) {
    errorMessage = (
      <>
        <h1>Błąd HTTP {error.status}</h1>
        <p>{error.data.message}</p>
      </>
    );
  }
  return (
    <>
      <NavBar />
      <main className='padded_content'>
        {errorMessage}
      </main>
      <Footer />
    </>
  );
};

export default ErrorPage;