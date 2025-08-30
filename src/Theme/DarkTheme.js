import { createTheme } from '@mui/material/styles';

export const DarkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#0C071B',
        },
        text: {
            primary: '#FFFFFF',
        },
        primary: {
            main: '#215106',
            light: 'rgba(255, 0, 50, 0.7)',
        }
    }
});