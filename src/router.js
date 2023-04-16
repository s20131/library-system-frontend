import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './pages/RootLayout';
import ResourcesPage from './pages/ResourcesPage';
import ErrorPage from './pages/ErrorPage';
import BookDetails from './components/book/BookDetails';
import EbookDetails from './components/ebook/EbookDetails';
import AuthPage from './pages/AuthPage';
import { action as authAction } from './components/auth/AuthForm';
import { authLoader, checkAuthLoader } from './utils/auth';
import HomePage from './pages/HomePage';
import StoragePage from './pages/StoragePage';
import RentalsPage from './pages/RentalsPage';
import AccountPage from './pages/AccountPage';
import ReservationsPage from './pages/ReservationsPage';

const router = createBrowserRouter([
  {
    path: '/',
    id: 'root',
    loader: authLoader,
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'auth', element: <AuthPage />, action: authAction },
      { path: 'books', element: <ResourcesPage resource='books' /> },
      { path: 'books/:bookId', element: <BookDetails /> },
      { path: 'ebooks', element: <ResourcesPage resource='ebooks' /> },
      { path: 'ebooks/:ebookId', element: <EbookDetails /> },
      { path: 'storage', element: <StoragePage />, loader: checkAuthLoader },
      { path: 'reservations', element: <ReservationsPage />, loader: checkAuthLoader },
      { path: 'rentals', element: <RentalsPage />, loader: checkAuthLoader },
      { path: 'account', element: <AccountPage />, loader: checkAuthLoader }
    ]
  }
]);

export default router;