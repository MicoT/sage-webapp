// Import React and testing utilities
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// Import the component you wish to test
import Login from './Login';

// Write a test
test('renders Login component', () => {
  render(<Login />);
  expect(screen.getByText('Login')).toBeInTheDocument();
});
