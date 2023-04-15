import './AuthForm.css';
import { Form, redirect, useSearchParams } from 'react-router-dom';
import ActionPart from './ActionPart';

const AuthForm = () => {
  const [params] = useSearchParams();
  const isLogin = params.get('mode') === 'login';
  const isRegister = !isLogin;

  return (
    <div className='wrapper'>
      <h1>{isLogin ? 'Logowanie' : 'Rejestracja'}</h1>
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
  const data = await request.formData();
  await fetch('http://localhost:8080/users', {
    method: 'post',
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
};