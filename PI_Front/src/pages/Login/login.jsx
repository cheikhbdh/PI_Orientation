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
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import GoogleIcon from '@mui/icons-material/Google';



// const defaultTheme = createTheme();
// const responseGoogle = (response) => {
// 	console.log(response);
// 	// Ici vous pouvez gérer la réponse et par exemple stocker le jeton d'accès
//   }
  
//   // Callback en cas d'échec
//   const failGoogle = (response) => {
// 	console.error(response);
// 	// Gérer l'échec de la connexion
//   }
  export default function Login() {
	// const axiosInstance = axios.create({
	// 	withCredentials: true,
	//   });
	const handleSubmit = async (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		console.log('Form submitted');
		console.log('Email:', data.get('email'));
		try {
		  const response = await axios.post('http://127.0.0.1:8000/login/', {
			login_or_email: data.get('email'),
			password: data.get('password'),
		  }, {
			withCredentials: true
		  });

	      console.log(response.data.role);

	
			if(response.status==200){
			localStorage.setItem("token",response.data.jwt)
		  if (response.data.role === 'etudiant') {
			window.location.href = '/home';
		  } else  {
			window.location.href = '/dashboard';
		  }
		}else{
          console.log("mots de pass incorrect")
		}
		  } 
		 catch (error) {
		  console.error('Login error:', error.response.data);
		  // Handle error here, e.g., display an error message
		}
	  };
	const googleButtonStyle = {
		marginBottom: '16px',
		background: 'black',
		color: 'white',
		boxShadow: 'none',
		textTransform: 'none',
		display: 'flex',
		justifyContent: 'center', 
		paddingLeft: (theme) => theme.spacing(1),
		paddingRight: (theme) => theme.spacing(1),
		height: '50px',
		borderRadius: '4px',
		border: '1px solid #dadce0', 
		margin: '20px ',
		'&:hover': {
		  boxShadow: 'none',
		  background: 'rgba(0, 0, 0, 0.04)',
		},
		'& .MuiButton-startIcon': {
		  marginRight: (theme) => theme.spacing(1),
		}
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
			  connexion
			</Typography>
			
			<Typography sx={{ marginY: '8px' }}>or</Typography>
			<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
			  <TextField
				margin="normal"
				required
				fullWidth
				id="email"
				label="Email Address"
				name="email"
				autoComplete="email"
				autoFocus
			  />
			  <TextField
				margin="normal"
				required
				fullWidth
				name="password"
				label="Mots de passe"
				type="password"
				id="password"
				autoComplete="current-password"
			  />
			  <Button
				type="submit"
				fullWidth
				variant="contained"
				sx={{ mt: 3, mb: 2 }}
			  >
				connecter
			  </Button>
			  <Grid container justifyContent="space-between">
				<Grid item>
				  <Link href="#" variant="body2">
					Forgot password?
				  </Link>
				</Grid>
				<Grid item>
				  <Link href="/register" variant="body2">
					{"tu n'a pas un compte? inscrit"}
				  </Link>
				</Grid>
			  </Grid>
			</Box>
		  </Box>
		</Container>

	);
  }