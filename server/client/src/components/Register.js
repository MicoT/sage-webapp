import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  // Include role in the initial state with a default value
  const [inputs, setInputs] = useState({ username: '', email: '', password: '', role: 'CCIS-admin' });

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', inputs);
      console.log(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" value={inputs.username} onChange={handleChange} />
      <input name="email" value={inputs.email} onChange={handleChange} />
      <input name="password" type="password" value={inputs.password} onChange={handleChange} />
      
      <select name="role" value={inputs.role} onChange={handleChange}>
        <option value="CCIS-admin">CCIS Admin</option>
        <option value="CEA-admin">CEA Admin</option>
        <option value="CHS-admin">CHS Admin</option>
        <option value="ATYCB-admin">ATYCB Admin</option>
        <option value="CAS-admin">CAS Admin</option>
        <option value="super-admin">Super Admin</option>
      </select>
      
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
