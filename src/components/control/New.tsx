import { Box, Grid, TextField } from "@mui/material";
import { User } from "firebase/auth";
import React from "react";

interface IProps {
  user: User;
}

export default function New(props: IProps): JSX.Element {
  return (
    <Box sx={{ p: 1.5 }}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField placeholder="Title" fullWidth focused={true} />
        </Grid>
        <Grid item xs={6}>
          <TextField placeholder="Date" type={"date"} fullWidth />
        </Grid>
      </Grid>
    </Box>
  );
}
