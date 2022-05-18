import React from "react";
import Map from "./Map/Map";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00456b",
    },
    secondary: {
      main: "#e11f26",
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
