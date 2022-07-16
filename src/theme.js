import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
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
  },
});

export default theme;
