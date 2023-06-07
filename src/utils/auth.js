import { json, redirect } from 'react-router-dom';

export const userKey = 'user';
export const rolesKey = 'roles';

export const authHeader = () => {
  const currentUser = localStorage.getItem(userKey);
  if (currentUser) {
    return { 'Authorization': 'Basic ' + currentUser };
  } else {
    return {};
  }
};

const getAuthToken = () => {
  return localStorage.getItem(userKey);
};

export const authLoader = () => {
  return {
    auth: getAuthToken(),
    librarian: checkLibrarianRole()
  };
};

export const checkAuthLoader = () => {
  const token = getAuthToken();
  if (!token) {
    return redirect('/auth?mode=login');
  }
  return null;
};

const getUserRoles = () => {
  return localStorage.getItem(rolesKey);
};

const checkLibrarianRole = () => {
  const roles = getUserRoles();
  if (!roles) return false;
  const userRoles = JSON.parse(roles).userRoles;
  return userRoles.includes('ROLE_LIBRARIAN');
};

export const checkLibrarianRoleLoader = () => {
  const isLibrarian = checkLibrarianRole();
  if (!isLibrarian) {
    throw json({ message: 'Podana strona nie istnieje' }, { status: 404 })
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem(userKey);
  localStorage.removeItem(rolesKey);
};