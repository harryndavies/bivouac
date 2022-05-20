import { Logout } from "@mui/icons-material";
import { Button } from "@mui/material";
import { signOut, getAuth } from "firebase/auth";
import React from "react";
import { app } from "../../firebase-config";

const styles = {
  container: {
    position: "absolute",
    bottom: 24,
    right: 11,
  },
};

function SessionControl(): JSX.Element {
  return (
    <Button
      startIcon={<Logout />}
      variant="contained"
      onClick={() => signOut(getAuth(app))}
      sx={styles.container}
      color="secondary"
    >
      Sign out
    </Button>
  );
}

export default React.memo(SessionControl);
