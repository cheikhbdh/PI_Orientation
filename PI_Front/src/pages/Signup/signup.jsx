import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';
import Alert from '@mui/material/Alert';

export default function SignUp() {
    const [showAlert, setShowAlert] = React.useState(false);
    const [alertMsg, setAlertMsg] = React.useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log('Form submitted');
        console.log('Email:', data.get('email'));

        try {
            const response = await axios.post('http://127.0.0.1:8000/register', {
                email: data.get('email'),
                login: data.get('username'),
                password: data.get('password'),
                confirm_password: data.get('confirmPassword')
            });

            if (response.status === 201) {
                setAlertMsg('Registration successful! Redirecting...');
                setShowAlert(true);
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);  // Redirect after 3 seconds
            } else {
                console.log("Registration successful");
            }
        } catch (error) {
            console.error('register error:', error.response?.data);
            setAlertMsg('Registration failed! Please try again.');
            setShowAlert(true);
            // Optionally reset alert visibility after some time
            setTimeout(() => {
                setShowAlert(false);
            }, 5000);
        }
    };

    const buttonStyle = {
        // Your button styles here
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                {showAlert && (
                    <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
                        {alertMsg}
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={buttonStyle}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="space-between">
                        <Grid item>
                            <Link href="/" variant="body2">
                                {"you already have an account? Sign in"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
