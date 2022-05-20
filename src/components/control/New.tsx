import { Box } from "@mui/material";
import { User } from "firebase/auth";
import React from "react";

interface IProps {
  user: User;
}

export default function New(props: IProps) {
  return <Box sx={{ p: 1.5 }}></Box>;
}
