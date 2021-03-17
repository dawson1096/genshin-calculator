import { red } from '@material-ui/core/colors';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: { main: '#556cd6' },
    secondary: { main: '#19857b' },
    error: { main: red.A400 },
    background: { default: '#fff' },
    textColor: { main: '#bd5e57' },
    stars: {
      five: 'linear-gradient(rgba(112,82,54,1) 60%, rgba(112,87,71,1) 80%, rgba(77,77,77,1) 100%)',
      four: 'linear-gradient(rgba(96,57,138,1) 60%, rgba(68,60,95,1) 80%, rgba(77,77,77,1) 100%)',
      three:
        'linear-gradient(rgba(51,123,156,1) 60%, rgba(44,94,116,1) 80%, rgba(77,77,77,1) 100%)',
      two: 'linear-gradient(rgba(95,146,109,1) 60%, rgba(72,101,101,1) 80%, rgba(77,77,77,1) 100%)',
      one:
        'linear-gradient(rgba(129,140,152,1) 60%, rgba(97,100,113,1) 80%, rgba(77,77,77,1) 100%)',
    },
  },
  spacing: (factor) => `${0.25 * factor}rem`,
});

export default responsiveFontSizes(theme);
