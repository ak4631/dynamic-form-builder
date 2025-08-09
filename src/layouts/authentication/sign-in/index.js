/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect, useState } from "react";

// react-router-dom components
import { Link, Navigate, useNavigate } from "react-router-dom";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import curved9 from "assets/images/curved-images/curved-6.jpg";

import { API_BASE_URL } from '../../../config'
import axios from 'axios';



function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);
  const [inputs, setInputs] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };

  const authenticateUser = async (event) => {
    event.preventDefault();

    if (!inputs.email && !inputs.password) {
      setError('Email & Password are required.');
      return;
    }
    if (!inputs.email) {
      setError('Email is required.');
      return;
    }
    if (!inputs.password) {
      setError('Password is required.');
      return;
    }
    console.log(inputs);
    setError(''); // Clear the error if validation passes

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, inputs);
      console.log("response = ", response);
      const { token } = response.data;

      if (token) {
        localStorage.setItem('jwt', token);
        navigate('dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred during login.');
      }
    }
  };

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem('jwt');
      if (token) {
        try {
          const response = await axios.get(`${API_BASE_URL}/checkLogIn`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.loggedIn) {
            navigate('dashboard');
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
            console.error('Unauthorized access - invalid or expired token');
            // Handle token expiry or invalid token
          } else {
            console.error('An error occurred:', error);
          }
        }
      }
    };

    fetchProtectedData();
  }, [navigate]);

  return (
    <CoverLayout
      title="Welcome back"
      description="Enter your email and password to sign in"
      image={curved9}
    >
      <SoftBox component="form" role="form">
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            </SoftTypography>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Email
            </SoftTypography>
          </SoftBox>
          <SoftInput
            type="email"
            placeholder="Email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </SoftBox>
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Password
            </SoftTypography>
          </SoftBox>
          <SoftInput
            type="password"
            placeholder="Password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </SoftBox>
        <SoftBox mt={4} mb={1}>
          <SoftButton variant="gradient" color="info" fullWidth onClick={authenticateUser}>
            Sign In
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </CoverLayout>
  );
}

export default SignIn;
