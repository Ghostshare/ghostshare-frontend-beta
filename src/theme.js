import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#2b75cd",
    },
    secondary: {
      main: "#2a9d8f",
    },
  },
  typography: {
    fontFamily: ["Quicksand", "Verdana", "Arial"].join(","),

    h1: {
      fontFamily: "EB Garamond, serif",
      fontWeight: "bold",
      fontSize: "5rem",
    },
    h2: {
      fontFamily: "EB Garamond, serif",
      fontWeight: "bold",
      fontSize: "3rem",
    },
    h3: {
      fontFamily: "EB Garamond, serif",
      fontWeight: "bold",
      fontSize: "2rem",
    },
    h4: {
      fontFamily: "EB Garamond, serif",
      fontWeight: "bold",
      fontSize: "1.4rem",
    },
    h5: {
      fontFamily: "EB Garamond, serif",
      fontWeight: "bold",
      fontSize: "1.2rem",
    },
    h6: {
      fontFamily: "EB Garamond, serif",
      fontWeight: "bold",
      fontSize: "1.1rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "1.1rem",
          borderRadius: "30px",
        },
      },
    },
    MuiContainer: {
      variants: [
        {
          props: { variant: "full-width" },
          style: {
            width: "100%",
          },
        },
      ],
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "0.8rem",
        },
      },
    },
  },
});

export default theme;
