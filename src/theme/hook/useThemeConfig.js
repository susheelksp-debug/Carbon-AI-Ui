// hooks/useThemeConfig.js
// This hook is deprecated - use Redux selectors and actions directly
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import {
    toggleMode,
    setMode,
    setLayoutType,
    setColorPreset,
    selectThemeSettings,
} from '../../redux/slices/theme';

/**
 * @deprecated Use Redux selectors and dispatch directly
 * Simplified hook for backward compatibility
 */
export const useThemeConfig = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const themeSettings = useSelector(selectThemeSettings);

    return {
        ...themeSettings,
        theme,
        isDark: themeSettings.mode === 'dark',
        isLight: themeSettings.mode === 'light',
        toggleMode: () => dispatch(toggleMode()),
        setMode: (mode) => dispatch(setMode(mode)),
        setLayoutType: (layout) => dispatch(setLayoutType(layout)),
        setColorPreset: (preset) => dispatch(setColorPreset(preset)),
    };
};