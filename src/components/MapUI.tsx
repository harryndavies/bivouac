import { Box } from "@mui/material";
import { getAuth } from "firebase/auth";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useWebMap } from "../factories/esri/hooks";
import { app } from "../firebase-config";
import Control from "./control/Control";
import { useCurrentGroup, useInitFeatureVisibility } from "./hooks/hooks";
import { use100vh } from "react-div-100vh";

export default function MapUI(): JSX.Element {
  const { mapRef, view } = useWebMap();

  const [user] = useAuthState(getAuth(app));

  const { currentGroup, setCurrentGroup } = useCurrentGroup(
    view,
    user?.email || ""
  );

  const height = use100vh();

  /**
   * Hide all features if user is not authenticated
   */
  useInitFeatureVisibility(view, user);

  return (
    <Box
      sx={{
        padding: 0,
        margin: 0,
        height: `calc(${height}px - 48px)`,
        width: "100vw",
        position: "relative",
      }}
      ref={mapRef}
    >
      {view ? (
        <Control
          view={view}
          currentGroup={currentGroup}
          setCurrentGroup={setCurrentGroup}
        />
      ) : null}
    </Box>
  );
}
