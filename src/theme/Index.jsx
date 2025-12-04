import PropTypes from 'prop-types';
import { useMemo } from 'react';

// @mui
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { palette } from './palette';
import { components } from './overrides/index';
import { typography } from './typography';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

export default function ThemeProvider({ children }) {

  const { mode, fontFamily, borderRadius, spacing } = useSelector((state) => state.theme);
  const theme = useMemo(() => {
    return createTheme({
      palette: palette(mode),
      spacing,
      typography: typography(fontFamily),
      components,
      shape: { borderRadius },
    });
  }, [mode, spacing, fontFamily, borderRadius]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};
