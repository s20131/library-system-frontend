import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './pages/RootLayout';
import ResourcesPage from './pages/ResourcesPage';
import ErrorPage from './pages/ErrorPage';
import BookDetails from './components/book/BookDetails';
import EbookDetails from './components/ebook/EbookDetails';
import AuthPage from './pages/AuthPage';
import { action as authAction } from './components/auth/AuthForm';
import { authLoader, checkAuthLoader, checkLibrarianRoleLoader } from './utils/auth';
import HomePage from './pages/HomePage';
import StoragePage from './pages/StoragePage';
import RentalsPage from './pages/RentalsPage';
import AccountPage from './pages/AccountPage';
import ReservationsPage from './pages/ReservationsPage';
import LibrarianPage from './pages/librarian/LibrarianPage';
import CompleteBookRentalPage from './pages/librarian/CompleteBookRentalPage';
import BorrowBookForCustomerPage from './pages/librarian/BorrowBookForCustomerPage';
import ReturnBookPage from './pages/librarian/ReturnBookPage';
import AddNewResourcePage from './pages/librarian/AddNewResourcePage';
import AddNewBookPage from './pages/librarian/AddNewBookPage';
import ChangeAvailabilityPage from './pages/librarian/ChangeAvailabilityPage';
import ChangeBooksAvailabilityPage from './pages/librarian/ChangeBooksAvailabilityPage';

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
      { path: 'books', element: <ResourcesPage resource='books' key='books' /> },
      { path: 'books/:bookId', element: <BookDetails /> },
      { path: 'ebooks', element: <ResourcesPage resource='ebooks' key='ebooks' /> },
      { path: 'ebooks/:ebookId', element: <EbookDetails /> },
      { path: 'storage', element: <StoragePage />, loader: checkAuthLoader },
      { path: 'reservations', element: <ReservationsPage />, loader: checkAuthLoader },
      { path: 'rentals', element: <RentalsPage />, loader: checkAuthLoader },
      { path: 'account', element: <AccountPage />, loader: checkAuthLoader },
      { path: 'librarian', element: <LibrarianPage />, loader: checkLibrarianRoleLoader },
      { path: 'librarian/rentals', element: <BorrowBookForCustomerPage />, loader: checkLibrarianRoleLoader },
      { path: 'librarian/rentals/complete', element: <CompleteBookRentalPage />, loader: checkLibrarianRoleLoader },
      { path: 'librarian/rentals/return', element: <ReturnBookPage />, loader: checkLibrarianRoleLoader },
      { path: 'librarian/resources/availability', element: <ChangeAvailabilityPage />, loader: checkLibrarianRoleLoader },
      { path: 'librarian/resources/availability/books', element: <ChangeBooksAvailabilityPage />, loader: checkLibrarianRoleLoader },
      //{ path: 'librarian/resources/availability/ebooks', element: <ChangeAvailabilityPage />, loader: checkLibrarianRoleLoader },
      { path: 'librarian/resources/add', element: <AddNewResourcePage />, loader: checkLibrarianRoleLoader },
      { path: 'librarian/resources/add/book', element: <AddNewBookPage />, loader: checkLibrarianRoleLoader },
    ]
  }
]);

export default router;