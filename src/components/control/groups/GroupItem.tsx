import { Menu } from "@mui/icons-material";
import { ListItem, ListItemText } from "@mui/material";
import { doc, getFirestore } from "firebase/firestore";
import React from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { app } from "../../../firebase-config";

interface IProps {
  id: string;
  backgroundColor: string;
  onClick(): void;
}

export default function GroupItem(props: IProps): JSX.Element {
  const [snapshot] = useDocument(doc(getFirestore(app), "groups", props.id));

  const data = snapshot?.data() ? snapshot?.data() : null;

  if (!data) {
    return <div></div>;
  }

  return (
    <ListItem
      sx={{
        backgroundColor: props.backgroundColor,
        ":hover": {
          backgroundColor: "#fafafa",
          cursor: "pointer",
        },
      }}
      onClick={props.onClick}
    >
      <Menu sx={{ color: "lightgray", fontSize: "18px" }} />
      <ListItemText sx={{ ml: 0.7 }} primary={data.name} />
    </ListItem>
  );
}
