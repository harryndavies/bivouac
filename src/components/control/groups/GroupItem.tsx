import { Clear, Edit, Group } from "@mui/icons-material";
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
import { app } from "../../../firebase-config";
import { GroupsModes, initialMode, GroupsMode } from "./Groups";

interface IProps {
  id: string;
  mode: GroupsMode;
  setMode(newMode: GroupsMode): void;
}

export default function GroupItem(props: IProps): JSX.Element {
  const [snapshot] = useDocument(doc(getFirestore(app), "groups", props.id));

  const data = snapshot?.data() ? snapshot?.data() : null;

  if (!data) {
    return <div></div>;
  }

  const toggleMode = () => {
    props.setMode({
      mode: GroupsModes.EDIT,
      group: { id: props.id, groupName: data.name },
    });
  };

  function renderActionButton() {
    return (
      <>
        {props.mode.group?.id === props.id ? (
          <IconButton
            edge="end"
            aria-label="reset"
            color="secondary"
            onClick={() => props.setMode(initialMode)}
          >
            <Clear />
          </IconButton>
        ) : (
          <IconButton
            edge="end"
            aria-label="edit"
            onClick={toggleMode}
            color="primary"
          >
            <Edit />
          </IconButton>
        )}
      </>
    );
  }

  return (
    <ListItem
      sx={{
        ":hover": {
          backgroundColor: "#fafafa",
          cursor: "pointer",
        },
        px: 2,
      }}
      secondaryAction={renderActionButton()}
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
