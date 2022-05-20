import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { FaCampground } from "react-icons/fa";
import constants from "../../app-config";

export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#0a3049" }}>
        <Toolbar variant="dense">
          <FaCampground fontSize={"20px"} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, ml: 1 }}
            fontWeight={500}
            letterSpacing={2}
          >
            {constants.appTitle}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
