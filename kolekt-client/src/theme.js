import { createTheme } from '@mui/material/styles';

export const theme = createTheme({

    palette: {
        mode: 'dark',

        primary: {
            main: '#1DB954', 
        },
        secondary: {
            main: '#ff6f61', 
        },

        background: {
            default: '#121212', // Fundo traseiro
            paper: '#1f1f1f',   // Fundo dos "cards"
        },
        
    },

    typography: {
        fontFamily: [
            'Quicksand', // fonte
            'sans-serif',
        ].join(','),
    },

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    textTransform: 'none',
                    fontWeight: 'bold',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    borderBottom: '1px solid #333',
                },
            },
        },
    },
});