import { RouterProvider } from 'react-router-dom';
import router from './router';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return <>
    <RouterProvider router={router} />
    <ToastContainer position='bottom-right' pauseOnHover={false} pauseOnFocusLoss={false} />
  </>;
};

export default App;
