import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useDocumentTitle } from "@react-hookz/web";
import MapUI from "./components/MapUI";
import ButtonAppBar from "./components/navigation/ButtonAppBar";

const theme = createTheme({
  palette: {
    primary: {
      main: "#005379",
    },
    secondary: {
      main: "#8E0045",
    },
  },

  typography: {
    fontFamily: `'Source Sans Pro', sans-serif`,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          textTransform: "none",
          color: "white",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: { border: "none" },
      },
    },
  },
});

function App(): JSX.Element {
  useDocumentTitle("Bivouac");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ButtonAppBar />
      <MapUI />
    </ThemeProvider>
  );
}

export default App;
