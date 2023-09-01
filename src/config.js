const config = {
  serverBaseUrl: process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : process.env.REACT_APP_BACKEND_URL,
  googleApiKey: process.env.REACT_APP_GOOGLE_API_KEY
};

export default config;