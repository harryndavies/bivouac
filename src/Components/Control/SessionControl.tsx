import { Logout } from "@mui/icons-material";
import { Button } from "@mui/material";
import { signOut, getAuth, User } from "firebase/auth";
import React from "react";
import { app } from "../../firebase-config";

const styles = {
  container: {
    position: "absolute",
    bottom: 24,
    right: 11,
  },
};

interface IProps {
  user: User;
}

export default function SessionControl(props: IProps) {
  return (
    <Button
      startIcon={<Logout />}
      variant="contained"
      onClick={() => signOut(getAuth(app))}
      sx={{ textTransform: "none", ...styles.container }}
      color="secondary"
    >
      Sign out
    </Button>
  );
}
