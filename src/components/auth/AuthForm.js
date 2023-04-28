import './AuthForm.css';
import { Form, redirect, useSearchParams } from 'react-router-dom';
import ActionPart from './ActionPart';
import config from '../../config';

const AuthForm = () => {
  const [params] = useSearchParams();
  const isLogin = params.get('mode') === 'login';
  const isRegister = !isLogin;

  return (
    <div className='wrapper'>
      <h1 className='form_title'>{isLogin ? 'Logowanie' : 'Rejestracja'}</h1>
      <Form method='post' className='login_form'>
        <label htmlFor='username'>Nazwa użytkownika</label>
        <input id='username' type='text' name='username' required />

        <label htmlFor='password'>Hasło</label>
        <input id='password' type='password' name='password' required />

        {isRegister &&
          <>
            <label htmlFor='firstName'>Imię</label>
            <input id='firstName' type='text' name='firstName' required />

            <label htmlFor='lastName'>Nazwisko</label>
            <input id='lastName' type='text' name='lastName' required />

            <label htmlFor='email'>Email</label>
            <input id='email' type='email' name='email' required />
          </>
        }

        <ActionPart mode={isLogin ? 'login' : 'register'} />
      </Form>
    </div>
  );
};

export default AuthForm;

export const action = async ({ request }) => {
  const queryParams = new URL(request.url).searchParams;
  const data = await request.formData();
  if (queryParams.get('mode') === 'register') {
    await fetch(`${config.baseUrl}/auth/register`, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: data.get('firstName'),
        lastName: data.get('lastName'),
        email: data.get('email'),
        username: data.get('username'),
        password: data.get('password')
      })
    });
    // TODO handle error response

    return redirect('/auth?mode=login');
  } else {
    const username = data.get('username');
    const password = data.get('password');
    const response = await fetch(`${config.baseUrl}/auth/login`, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    if (response.ok) {
      const encodedUser = window.btoa(username + ':' + password);
      localStorage.setItem('user', encodedUser);
      return redirect('/books');
    }
    // TODO handle error response

    return null;
  }
};