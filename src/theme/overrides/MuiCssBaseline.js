export const MuiCssBaseline = {
    styleOverrides: {
        ":root": {
            fontSynthesis: "none",
            textRendering: "optimizeLegibility",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            // fontStyle: "normal"
        },
        "*, *::before, *::after": {
            boxSizing: "border-box",
        },
        body: {
            margin: "0px",
            padding: "0px",
            minWidth: "320px",
            minHeight: "100vh",


        },
        "#root": {
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            fontStyle: "normal",
            fontSynthesis: "none",
            textRendering: "optimizeLegibility",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
        },
        /* === Scrollbar Styling === */
        "::-webkit-scrollbar": {
            width: "8px",
        },
        "::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            borderRadius: "4px",
        },
        "::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
    },
};