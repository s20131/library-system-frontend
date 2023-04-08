import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './pages/RootLayout';
import ResourcesPage from './pages/ResourcesPage';
import ErrorPage from './pages/ErrorPage';
import BookDetails from './components/book/BookDetails';
import EbookDetails from './components/ebook/EbookDetails';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: 'books', element: <ResourcesPage resource='books' /> },
      { path: 'books/:bookId', element: <BookDetails /> },
      { path: 'ebooks', element: <ResourcesPage resource='ebooks' /> },
      { path: 'ebooks/:ebookId', element: <EbookDetails /> }
    ]
  }
]);

export default router;