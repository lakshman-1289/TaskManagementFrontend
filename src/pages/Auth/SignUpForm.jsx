import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../ReduxToolkit/oSlice';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function SignUpForm({ togglePanel, setIsRegister }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        // Clear form fields on successful registration
        setFormData({
          fullName: '',
          email: '',
          password: '',
          role: '',
        });
        // Switch to sign-in view
        if (setIsRegister) {
          setIsRegister(false);
        }
      }
    });
  };

  return (
    <div className="space-y-3 mt-5 flex flex-col items-center gap-2 py-5 justify-center">
      <h1 className="text-lg font-bold text-center kb8 text-style">Register</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          fullWidth
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
          margin="normal"
        />
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
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            value={formData.role}
            onChange={handleChange}
            label="Role"
            name="role"
          >
            <MenuItem value="ROLE_CUSTOMER">User</MenuItem>
            <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
          </Select>
        </FormControl>
        <div>
          <Button
            type="submit"
            fullWidth
            sx={{ padding: '0.9rem' }}
            className="custom-button"
          >
            Register
          </Button>
        </div>
      </form>
      <div className="mt-5 flex items-center gap-2 py-5 justify-center">
        <span>Already have an account?</span>
        <Button onClick={togglePanel} sx={{ color: '#c24dd0' }}>Sign In</Button>
      </div>
    </div>
  );
}

export default SignUpForm;