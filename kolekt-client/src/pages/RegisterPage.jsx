import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Paper,
    Link as MuiLink
} from '@mui/material';

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password.length < 4) {
            setError('A senha deve ter pelo menos 4 caracteres.');
            return;
        }
        setIsLoading(true);

        try {
            await axios.post('http://localhost:3001/auth/register', {
                email: email,
                password: password,
            });

            alert('Registro realizado com sucesso! Você será redirecionado para o login.');
            navigate('/login');

        } catch (err) {
            console.error('Erro no registro:', err.response?.data?.error);
            setError(err.response?.data?.error || 'Erro ao tentar registrar.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Typography
                component="h1"
                variant="h2"
                sx={{
                    fontWeight: 'bold',
                    fontFamily: 'Quicksand',
                    mb: 4
                }}
            >
                Kolekt
            </Typography>
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    maxWidth: '400px',
                    width: '100%',
                }}
            >
                <Typography component="h1" variant="h5">
                    Criar Conta
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Endereço de Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Senha"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Registrar'}
                    </Button>

                    <Box sx={{ textAlign: 'center' }}>
                        <MuiLink component={RouterLink} to="/login" variant="body2">
                            Já tem uma conta? Faça login
                        </MuiLink>
                    </Box>

                </Box>
            </Paper>
        </Box>
    );
}

export default RegisterPage;