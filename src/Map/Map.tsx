import { Box } from "@mui/material";
import React from "react";
import { useWebMap } from "../factories/esri/hooks";
import Create from "./Create";

export default function Map() {
  const { mapRef, view } = useWebMap();

  return (
    <Box
      sx={{
        padding: 0,
        margin: 0,
        height: "100vh",
        width: "100vw",
        position: "relative",
      }}
      ref={mapRef}
    >
      {view ? <Create view={view} /> : null}
    </Box>
  );
}
