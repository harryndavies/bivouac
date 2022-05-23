import { ListItem, ListItemText } from "@mui/material";
import { doc, getFirestore } from "firebase/firestore";
import React from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { FaUsers } from "react-icons/fa";
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
      <FaUsers style={{ color: "lightgray", fontSize: "20px" }} />
      <ListItemText
        sx={{ ml: 2 }}
        primary={data.name}
        secondary={`Created by ${data.admin}`}
      />
    </ListItem>
  );
}
