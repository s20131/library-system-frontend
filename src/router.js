import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './pages/RootLayout';
import BooksPage from './pages/BooksPage';
import ErrorPage from './pages/ErrorPage';
import BookDetails from './components/book/BookDetails';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: 'books', element: <BooksPage /> },
      { path: 'books/:bookId', element: <BookDetails /> }
    ]
  }
]);

export default router;