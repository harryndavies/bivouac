import { Box } from "@mui/material";
import { getAuth } from "firebase/auth";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getFeatureLayers } from "../factories/esri/helpers";
import { useWebMap } from "../factories/esri/hooks";
import { app } from "../firebase-config";
import Control from "./control/Control";
import GroupControl from "./control/groups/GroupControl";

export default function MapUI(): JSX.Element {
  const { mapRef, view } = useWebMap();
  const [user] = useAuthState(getAuth(app));
  const [currentGroup, setCurrentGroup] = React.useState<string>("");

  /**
   * Hide all features if no user authenticated
   */
  React.useEffect(() => {
    if (view) {
      const [l] = getFeatureLayers(view, ["sites"]);

      if (!user) {
        l.definitionExpression = "1 = 2";
      } else {
        l.definitionExpression = "1 = 1";
      }
    }
  }, [view, user]);

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
      {view ? <Control view={view} currentGroup={currentGroup} /> : null}

      {user && view ? (
        <GroupControl
          user={user}
          view={view}
          currentGroup={currentGroup}
          setCurrentGroup={setCurrentGroup}
        />
      ) : null}
    </Box>
  );
}
