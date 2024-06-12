import * as React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
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
    const [isVerificationStep, setIsVerificationStep] = React.useState(false);
    const [verificationCode, setVerificationCode] = React.useState('');
    const [generatedCode, setGeneratedCode] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        // Step 1: Verify email
        if (!isVerificationStep) {
            const email = data.get('email');
            const username = data.get('username');
            const password = data.get('password');
            const confirmPassword = data.get('confirmPassword');

            // Validate input fields
            if (!email || !password || !confirmPassword || !username) {
                setAlertMsg('Tous les champs sont obligatoires ! Veuillez remplir tous les champs requis.');
                setAlertSeverity('error');
                setShowAlert(true);
                return;
            }

            // Validate password strength
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
            if (!passwordRegex.test(password)) {
                setAlertMsg('Mot de passe faible ! Veuillez inclure au moins une lettre majuscule, une lettre minuscule et un chiffre.');
                setAlertSeverity('error');
                setShowAlert(true);
                return;
            }

            // Validate username
            const usernameRegex = /^[a-zA-Z]+$/;
            if (!usernameRegex.test(username)) {
                setAlertMsg('Nom d\'utilisateur invalide ! Veuillez utiliser uniquement des caractères alphanumériques.');
                setAlertSeverity('error');
                setShowAlert(true);
                return;
            }

            try {
                const response = await axios.post('http://127.0.0.1:8000/verify-email/', { email });

                if (response.status === 200) {
                    setGeneratedCode(response.data.verification_code);
                    setIsVerificationStep(true);
                    setEmail(email);
                    setUsername(username);
                    setPassword(password);
                    setConfirmPassword(confirmPassword);
                    setAlertMsg('Code de vérification envoyé à votre adresse e-mail.');
                    setAlertSeverity('success');
                    setShowAlert(true);
                }
            } catch (error) {
                console.error('Erreur de vérification :', error.response?.data);
                setAlertMsg(error.response?.data.error || 'Erreur lors de l\'envoi du code de vérification.');
                setAlertSeverity('error');
                setShowAlert(true);
            }
        } else {
            // Step 2: Verify the code and register
            if (verificationCode !== generatedCode) {
                setAlertMsg('Code de vérification incorrect. Veuillez réessayer.');
                setAlertSeverity('error');
                setShowAlert(true);
                return;
            }

            try {
                const response = await axios.post('http://127.0.0.1:8000/register/', {
                    email,
                    login: username,
                    password,
                    confirm_password: confirmPassword
                });

                if (response.status === 201) {
                    setAlertMsg('Inscription réussie ! Redirection...');
                    setAlertSeverity('success');
                    setShowAlert(true);
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 3000);
                }
            } catch (error) {
                console.error('Erreur d\'inscription :', error.response?.data);
                setAlertMsg(error.response?.data.error);
                setAlertSeverity('error');
                setShowAlert(true);
            }
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
                    {!isVerificationStep ? (
                        <>
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
                        </>
                    ) : (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="verificationCode"
                            label="Code de vérification"
                            type="text"
                            id="verificationCode"
                            autoComplete="off"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={buttonStyle}
                    >
                        {isVerificationStep ? "Vérifier le code" : "S'inscrire"}
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