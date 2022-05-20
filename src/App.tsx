import React from "react";
import Map from "./Map/Map";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#007f5f",
    },
    secondary: {
      main: "#38a3a5",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Map />
    </ThemeProvider>
  );
}

export default App;
