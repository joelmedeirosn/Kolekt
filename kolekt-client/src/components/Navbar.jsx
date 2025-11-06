import React from 'react';
import { AppBar, Box, Toolbar, Button, Link as ChakraLink } from '@mui/material'; // Removido Typography e Heading
import { Link as RouterLink, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('kolekt-token');

    const handleLogout = () => {
        localStorage.removeItem('kolekt-token');
        navigate('/login');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="static"
                elevation={0} 
                sx={{ backgroundColor: 'transparent' }} 
            >
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }} />

                    <Box>
                        {token ? (
                            <Button color="inherit" onClick={handleLogout} sx={{ fontWeight: 'bold' }}>
                                Sair
                            </Button>
                        ) : (
                            <>
                                <Button color="inherit" component={RouterLink} to="/login" sx={{ fontWeight: 'bold' }}>
                                    Login
                                </Button>
                                <Button color="inherit" component={RouterLink} to="/register" sx={{ fontWeight: 'bold' }}>
                                    Registrar
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar;