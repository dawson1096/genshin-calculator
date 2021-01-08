import { red } from '@material-ui/core/colors';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
    palette: {
        primary: { main: '#556cd6' },
        secondary: { main: '#19857b' },
        error: { main: red.A400 },
        background: { default: '#fff' },
    },
    spacing: factor => `${0.25 * factor}rem`,
});
export default responsiveFontSizes(theme);