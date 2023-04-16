const key = 'user'

export const authHeader = () => {
  const currentUser = localStorage.getItem(key)
  if (currentUser) {
    return { 'Authorization': 'Basic ' + currentUser}
  } else {
    return {}
  }
}

export const authLoader = () => {
  return localStorage.getItem(key)
}

export const logout = () => {
  localStorage.removeItem(key)
}