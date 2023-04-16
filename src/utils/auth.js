import { redirect } from 'react-router-dom';

const key = 'user';

export const authHeader = () => {
  const currentUser = localStorage.getItem(key);
  if (currentUser) {
    return { 'Authorization': 'Basic ' + currentUser };
  } else {
    return {};
  }
};

const getAuthToken = () => {
  return localStorage.getItem(key);
};

export const authLoader = () => {
  return getAuthToken();
};

export const checkAuthLoader = () => {
  const token = getAuthToken();
  if (!token) {
    return redirect('/auth?mode=login');
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem(key);
};