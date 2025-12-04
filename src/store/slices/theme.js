import { createSlice } from '@reduxjs/toolkit';

// ============ Initial State ============
const initialState = {
    mode: 'light',
    // fontFamily: 'Outfit, sans-serif',
    fontFamily: "Inter",
    layoutType: 'vertical',
    direction: 'ltr',
    borderRadius: 4,
    spacing: 8,
    containerWidth: 'lg',
};

// ============ Theme Slice ============
const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        // Toggle between light and dark mode
        toggleMode: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        },

        // Set specific mode (light or dark)
        setMode: (state, action) => {
            state.mode = action.payload;
        },

        // Set font family
        setFontFamily: (state, action) => {
            state.fontFamily = action.payload;
        },

        // Set layout type
        setLayoutType: (state, action) => {
            state.layoutType = action.payload;
        },

        // Toggle direction (RTL/LTR)
        toggleDirection: (state) => {
            state.direction = state.direction === 'ltr' ? 'rtl' : 'ltr';
        },

        // Set direction
        setDirection: (state, action) => {
            state.direction = action.payload;
        },

        // Set border radius
        setBorderRadius: (state, action) => {
            state.borderRadius = action.payload;
        },

        // New customization actions
        setSpacing: (state, action) => {
            state.spacing = action.payload;
        },
        setContainerWidth: (state, action) => {
            state.containerWidth = action.payload;
        },

        // Reset theme to defaults
        resetTheme: () => initialState,

    },
    extraReducers: (builder) => {
        builder.addCase('RESET_ALL', () => initialState);  // Reset to initial state
    },
});

// ============ Exports ============
export const {
    toggleMode,
    setMode,
    setLayoutType,
    setFontFamily,
    toggleDirection,
    setDirection,
    setBorderRadius,
    resetTheme,
    setSpacing,
    setContainerWidth,
} = themeSlice.actions;

// Selectors
export const selectThemeMode = (state) => state.theme.mode;
export const selectLayoutType = (state) => state.theme.layoutType;
export const selectFontFamily = (state) => state.theme.fontFamily;
export const selectDirection = (state) => state.theme.direction;
export const selectBorderRadius = (state) => state.theme.borderRadius;
export const selectSpacing = (state) => state.theme.spacing;
export const selectContainerWidth = (state) => state.theme.containerWidth;

export default themeSlice.reducer;