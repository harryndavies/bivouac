import { Box, Button, Grid } from "@mui/material";
import React from "react";
import { getAuth } from "firebase/auth";
import { app } from "../../firebase-config";
import { useSignInWithFacebook } from "react-firebase-hooks/auth";
import { Modes } from "./Control";
import { FacebookRounded } from "@mui/icons-material";

interface IProps {
  setMode(newMode: Modes): void;
}

export default function Auth(props: IProps) {
  const [signInWithFacebook, user] = useSignInWithFacebook(getAuth(app));

  // Redirect if user is authenticated
  React.useEffect(() => {
    if (user) {
      props.setMode(Modes.NEW);
    }
  }, [user, props]);

  return (
    <Box sx={{ p: 1.5 }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Button
            fullWidth
            startIcon={<FacebookRounded />}
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 700,
              backgroundColor: "#3578e5",
              color: "white",
              ":hover": { backgroundColor: "#3578e5" },
            }}
            onClick={() => signInWithFacebook()}
          >
            Login with Facebook
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
