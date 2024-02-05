import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Paper, Typography, Container } from '@mui/material';
import logo from '../assets/sage.png'; // Update the path if necessary

const Login = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [isLoginView, setIsLoginView] = useState(true);
    const [loginInputs, setLoginInputs] = useState({ email: '', password: '' });
    const [registerInputs, setRegisterInputs] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
  
    const handleLoginChange = (e) => {
      setLoginInputs({ ...loginInputs, [e.target.name]: e.target.value });
    };
  
    const handleRegisterChange = (e) => {
      setRegisterInputs({ ...registerInputs, [e.target.name]: e.target.value });
    };
  
    const handleLoginSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', loginInputs);
        localStorage.setItem('token', response.data.token);
        // After setting the token, navigate to the dashboard
        navigate('/dashboard', { replace: true });
      } catch (error) {
        setError(error.response.data.msg || 'Error occurred while logging in.');
      }
    };
  
    const handleRegisterSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:5000/api/auth/register', registerInputs);
        localStorage.setItem('token', response.data.token);
        // Navigate to the dashboard on successful registration
        navigate('/dashboard', { replace: true });
      } catch (error) {
        setError(error.response.data.msg || 'Error occurred during registration.');
      }
    };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ mt: 12, mb: 4, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          component="img"
          src={logo}
          sx={{ width: '100%', height: 'auto', mt: 1, mb: 4 }}
        />
        <Typography component="h1" variant="h5">
          {isLoginView ? 'Login' : 'Register'}
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box component="form" onSubmit={isLoginView ? handleLoginSubmit : handleRegisterSubmit} sx={{ mt: 1 }}>
          {isLoginView ? (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={loginInputs.email}
                onChange={handleLoginChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={loginInputs.password}
                onChange={handleLoginChange}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Login
              </Button>
            </>
          ) : (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={registerInputs.username}
                onChange={handleRegisterChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={registerInputs.email}
                onChange={handleRegisterChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={registerInputs.password}
                onChange={handleRegisterChange}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Register
              </Button>
            </>
          )}
          <Button onClick={() => setIsLoginView(!isLoginView)} fullWidth variant="text">
            {isLoginView ? 'Go to Registration' : 'Go to Login'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
