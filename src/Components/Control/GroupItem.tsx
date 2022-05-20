import { Clear, Group } from "@mui/icons-material";
import {
  ListItem,
  IconButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import { doc, getFirestore } from "firebase/firestore";
import React from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { app } from "../../firebase-config";

interface IProps {
  id: string;
}

export default function GroupItem(props: IProps) {
  const [snapshot] = useDocument(doc(getFirestore(app), "groups", props.id));

  const data = snapshot?.data() ? snapshot?.data() : null;

  if (!data) {
    return <div></div>;
  }

  return (
    <ListItem
      sx={{
        ":hover": {
          backgroundColor: "#fafafa",
          cursor: "pointer",
        },
        py: "6px",
        px: "16px",
      }}
      secondaryAction={
        <IconButton edge="end" aria-label="delete">
          <Clear />
        </IconButton>
      }
    >
      <ListItemAvatar>
        <Avatar sx={{ width: 30, height: 30 }}>
          <Group />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={data.name} />
    </ListItem>
  );
}
