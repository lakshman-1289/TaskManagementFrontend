import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../ReduxToolkit/oSlice';
import { getUserProfile } from '../../ReduxToolkit/oSlice';
import { TextField, Button } from '@mui/material';

function SignInForm({ togglePanel }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled' && result.payload.jwt) {
        // Fetch user profile after successful login
        dispatch(getUserProfile(result.payload.jwt));
      }
    });
  };

  return (
    <div className="space-y-3 mt-5 flex flex-col items-center gap-2 py-5 justify-center">
      <h1 className="text-lg font-bold text-center kb8 text-style">Login</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          fullWidth
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          margin="normal"
        />
        <TextField
          label="Password"
          fullWidth
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          margin="normal"
        />
        <div>
          <Button
            type="submit"
            fullWidth
            sx={{ padding: '0.9rem' }}
            className="custom-button"
          >
            Login
          </Button>
        </div>
      </form>
      <div className="mt-5 flex items-center gap-2 py-5 justify-center">
        <span>Don't have an account?</span>
        <Button onClick={togglePanel} sx={{ color: '#c24dd0' }}>Sign Up</Button>
      </div>
    </div>
  );
}

export default SignInForm;