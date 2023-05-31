import { RouterProvider } from 'react-router-dom';
import router from './router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return <>
    <RouterProvider router={router} />
    <ToastContainer position='bottom-right' pauseOnHover={false} pauseOnFocusLoss={false} />
  </>;
};

export default App;
