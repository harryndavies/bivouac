import { Clear } from "@mui/icons-material";
import { Box, OutlinedInput, InputAdornment, IconButton } from "@mui/material";
import React from "react";
import { Modes } from "./Control";

interface IProps {
  setMode(newMode: Modes): void;
}

export default function Search(props: IProps) {
  return (
    <Box>
      <Box
        display={"flex"}
        alignItems="center"
        sx={{ borderBottom: "1px solid lightgray" }}
      >
        <OutlinedInput
          fullWidth
          placeholder="Search"
          autoFocus={true}
          sx={{ padding: "4px 12px" }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                edge="end"
                sx={{ marginRight: "12px" }}
                size="small"
                onClick={() => props.setMode(Modes.NONE)}
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          }
        />
      </Box>
      <Box
        sx={{
          height: 166,
          backgroundColor: "#f2f4f5",
        }}
      ></Box>
    </Box>
  );
}
