import { Box } from "@mui/material";
import { getAuth } from "firebase/auth";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useWebMap } from "../factories/esri/hooks";
import { app } from "../firebase-config";
import Control from "./control/Control";
import SessionControl from "./control/SessionControl";

export default function MapUI(): JSX.Element {
  const { mapRef, view } = useWebMap();
  const [user] = useAuthState(getAuth(app));

  return (
    <Box
      sx={{
        padding: 0,
        margin: 0,
        height: "calc(100vh - 48px)",
        width: "100vw",
        position: "relative",
      }}
      ref={mapRef}
    >
      {view ? <Control view={view} /> : null}
      {user ? <SessionControl /> : null}
    </Box>
  );
}
