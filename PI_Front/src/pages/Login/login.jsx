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
const responseGoogle = (response) => {
	console.log(response);
	// Ici vous pouvez gérer la réponse et par exemple stocker le jeton d'accès
  }
  
  // Callback en cas d'échec
  const failGoogle = (response) => {
	console.error(response);
	// Gérer l'échec de la connexion
  }
  export default function Login() {
	const handleSubmit = (event) => {
	  event.preventDefault();
	  const data = new FormData(event.currentTarget);
	  console.log({
		email: data.get('email'),
		password: data.get('password'),
	  });
	};
	const googleButtonStyle = {
		// marginBottom: '16px',
		background: 'black',
		color: 'white',
		boxShadow: 'none',
		textTransform: 'none',
		display: 'flex',
		justifyContent: 'center', // Centre le texte et l'icône
		paddingLeft: (theme) => theme.spacing(1),
		paddingRight: (theme) => theme.spacing(1),
		height: '50px', // Augmente la hauteur du bouton
		borderRadius: '4px', // Angles arrondis, ajustez selon vos préférences
		border: '1px solid #dadce0', // Ajoute une bordure subtile
		margin: '20px ', // Ajoute un peu d'espace autour du bouton
		'&:hover': {
		  boxShadow: 'none',
		  background: 'rgba(0, 0, 0, 0.04)',
		},
		'& .MuiButton-startIcon': {
		  marginRight: (theme) => theme.spacing(1),
		}
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
			  connexion
			</Typography>
			<GoogleLogin
			  clientId="7873-0960-9645" // Remplacez par votre ID client obtenu de Google
			  render={renderProps => (
				<Button
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                startIcon={
					<Avatar sx={{ bgcolor: 'white', marginRight: 2 }}>
					  <GoogleIcon sx={{ color: '#DB4437' }} /> {/* Couleur du logo Google */}
					</Avatar>
				  }
                sx={googleButtonStyle}
                fullWidth
              >
                Continuer avec Google
              </Button>
			  )}
			  onSuccess={responseGoogle}
			  onFailure={failGoogle}
			  cookiePolicy={'single_host_origin'}
			/>
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
	  </ThemeProvider>
	);
  }