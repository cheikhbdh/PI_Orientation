
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
    const [alertSeverity, setAlertSeverity] = React.useState('success');
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const password = data.get('password');
        const username = data.get('username');

        // Vérification des champs obligatoires
        if (!data.get('email') || !password || !data.get('confirmPassword') || !username) {
            setAlertMsg('Tous les champs sont obligatoires ! Veuillez remplir tous les champs requis.');
            setAlertSeverity('error')
            setShowAlert(true);
            setAlertSeverity('error')
            return;
        }

        // Validation du mot de passe
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            setAlertMsg('Mot de passe faible ! Veuillez inclure au moins une lettre majuscule, une lettre minuscule et un chiffre.');
            setShowAlert(true);
            setAlertSeverity('error')
            return;
        }

        // Validation du nom d'utilisateur
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if (!usernameRegex.test(username)) {
            setAlertMsg('Nom d\'utilisateur invalide ! Veuillez utiliser uniquement des caractères alphanumériques.');
            setShowAlert(true);
            setAlertSeverity('error')
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/register/', {
                email: data.get('email'),
                login: username,
                password: password,
                confirm_password: data.get('confirmPassword')
            });

            if (response.status === 201) {
                setAlertMsg('Inscription réussie ! Redirection...');
                setShowAlert(true);
                setAlertSeverity('success')
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
            } else {
                
            }
        } catch (error) {
            console.error('Erreur d\'inscription :', error.response?.data);
            setAlertMsg(error.response?.data.error);
            setShowAlert(true);
            setAlertSeverity('error')
            setTimeout(() => {
                setShowAlert(false);
            }, 5000);
        }
    };

    const buttonStyle = {
        // Vos styles de bouton ici
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
                    Inscription
                </Typography>
                {showAlert && (
                    <Alert severity={alertSeverity} sx={{ width: '100%', mt: 2 }}>
                        {alertMsg}
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Adresse e-mail"
                        name="email"
                        autoComplete="email"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Nom d'utilisateur"
                        name="username"
                        autoComplete="username"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Mot de passe"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirmer le mot de passe"
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
                        S'inscrire
                    </Button>
                    <Grid container justifyContent="space-between">
                        <Grid item>
                            <Link href="/" variant="body2">
                                {"Vous avez déjà un compte ? Connectez-vous"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
