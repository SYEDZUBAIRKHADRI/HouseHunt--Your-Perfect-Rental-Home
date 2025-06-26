import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from 'react-bootstrap';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { message } from 'antd';

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      return message.warning("Please fill all fields");
    }

    axios.post('http://localhost:8001/api/user/login', data)
      .then((res) => {
        console.log("🔐 Login API Response:", res.data);

        if (res.data.success) {
          message.success(res.data.message);

          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));

          const isLoggedIn = JSON.parse(localStorage.getItem("user"));
          console.log("✅ Logged in user object:", isLoggedIn);

          switch (isLoggedIn.type) {
            case "Admin":
              navigate("/adminhome");
              break;
            case "Renter":
              navigate("/renterhome");
              break;
            case "Owner":
             navigate("/ownerhome");
              break;
            default:
              message.error("Unknown user type");
              break;
          }

          // Optional: reload to refresh state
          setTimeout(() => {
            window.location.reload();
          }, 1000);

        } else {
          message.error(res.data.message || "Login failed. Please try again");
        }
      })
      .catch((err) => {
        console.error("❌ Login API Error:", err);
        message.error("Something went wrong");
      });
  };

  return (
    <>
      {/* Navbar */}
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand><h2>RentEase</h2></Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" navbarScroll />
            <Nav>
              <Link to={'/'} style={{ margin: "0 10px" }}>Home</Link>
              <Link to={'/login'} style={{ margin: "0 10px" }}>Login</Link>
              <Link to={'/register'} style={{ margin: "0 10px" }}>Register</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Login Form */}
      <Container component="main">
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={data.email}
              onChange={handleChange}
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={data.password}
              onChange={handleChange}
              autoComplete="current-password"
            />

            <Box mt={2} display="flex" justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                style={{ width: '200px', backgroundColor: '#1976d2', color: '#fff' }}
              >
                Sign In
              </Button>
            </Box>

            <Grid container sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                Forgot password?
                <Link style={{ color: "red" }} to="/forgotpassword">
                  {" Click here"}
                </Link>
              </Grid>
              <Grid item xs={12} sm={6}>
                Don't have an account?
                <Link style={{ color: "blue" }} to="/register">
                  {" Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
