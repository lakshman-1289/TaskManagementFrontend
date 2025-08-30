import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from './ReduxToolkit/oSlice';
import { DarkTheme } from './Theme/DarkTheme';
import Navbar from './pages/Navbar/Navbar';
import Home from './pages/Home/Home';
import Auth from './pages/Auth/Auth';

function App() {
  const dispatch = useDispatch();
  const { user, jwt, loggedIn, error } = useSelector((store) => store.auth);

  useEffect(() => {
    const storedJwt = localStorage.getItem('jwt');
    
    if (storedJwt) {
      dispatch(getUserProfile(storedJwt)).then((result) => {
        // Handle result if needed
      });
    }
  }, [dispatch]);

  // Log authentication state changes
  useEffect(() => {
    // Monitoring auth state changes
  }, [user, jwt, loggedIn, error]);

  // Additional debugging for render decision
  

  return (
    <ThemeProvider theme={DarkTheme}>
      {user ? (
        <div className="relative">
          <Navbar />
          <Home />
        </div>
      ) : (
        <Auth />
      )}
    </ThemeProvider>
  );
}

export default App;