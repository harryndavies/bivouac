import { Box } from "@mui/material";
import { getAuth } from "firebase/auth";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useWebMap } from "../factories/esri/hooks";
import { app } from "../firebase-config";
import Control from "../Components/Control/Control";
import SessionControl from "../Components/Control/SessionControl";

export default function Map() {
  const { mapRef, view } = useWebMap();
  const [user] = useAuthState(getAuth(app));

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
      {view ? <Control view={view} /> : null}
      {user ? <SessionControl user={user} /> : null}
    </Box>
  );
}
