import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useDocumentTitle } from "@react-hookz/web";
import MapUI from "./components/control/MapUI";

const theme = createTheme({
  palette: {
    primary: {
      main: "#007f5f",
    },
    secondary: {
      main: "#38a3a5",
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
        },
      },
    },
  },
});

function App() {
  useDocumentTitle("Bivouac");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MapUI />
    </ThemeProvider>
  );
}

export default App;
