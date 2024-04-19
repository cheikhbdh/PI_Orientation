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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { GoogleLogin } from 'react-google-login';
import GoogleIcon from '@mui/icons-material/Google';
const defaultTheme = createTheme();
export default function SignUp() {
	const handleSubmit = (event) => {
	  event.preventDefault();
	  const data = new FormData(event.currentTarget);
	  // Assurez-vous que les mots de passe correspondent avant de soumettre
	  if (data.get('password') === data.get('confirmPassword')) {
		console.log({
		  email: data.get('email'),
		  username: data.get('username'),
		  password: data.get('password'),
		  // Ne pas logger le confirmPassword pour des raisons de sécurité
		});
		// Ici, vous pouvez traiter les données d'inscription
	  } else {
		// Gérer l'erreur de mot de passe non correspondant
		console.error("Passwords don't match");
	  }
	};
  
	// Styles peuvent être réutilisés ou personnalisés ici
	const buttonStyle = {
	  // Vos styles de bouton
	};
  
	return (
	  <ThemeProvider theme={defaultTheme}>
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
					{"you already  have an account? Sign in"}
				  </Link>
				</Grid>
			  </Grid>
			</Box>
		  </Box>
		</Container>
	  </ThemeProvider>
	);
  }
  