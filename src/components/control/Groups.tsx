import { Add } from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  List,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { User } from "firebase/auth";
import { where } from "firebase/firestore";
import React from "react";
import { FirestoreDB } from "../../factories/firestore/firestore";
import { useLiveDocuments } from "../../factories/utils/hooks";
import { IMembership } from "../../shared/types";
import EditGroup from "./EditGroup";
import GroupItem from "./GroupItem";

export enum GroupsModes {
  NEW,
  EDIT,
}

export type Mode = {
  mode: GroupsModes;
  group: { id: string; groupName: string } | undefined;
};

export const initialMode = {
  mode: GroupsModes.NEW,
  group: undefined,
};

interface IProps {
  user: User;
}

export default function Groups(props: IProps): JSX.Element {
  const [mode, setMode] = React.useState<Mode>(initialMode);

  const [newGroupName, setNewGroupName] = React.useState<string>("");

  const myMemberships = useLiveDocuments<IMembership>({
    collectionName: "memberships",
    queryConstraints: [where("user", "==", props.user.email)],
  });

  const db = React.useMemo(() => new FirestoreDB(), []);

  const createGroup = () => {
    if (props.user.email) {
      try {
        db.createGroup({ name: newGroupName, admin: props.user.email });
        setNewGroupName("");
      } catch (error) {
        console.warn(error);
      }
    }
  };

  return (
    <Box>
      <List sx={{ my: 0, py: 0 }}>
        {myMemberships.map((m) => (
          <GroupItem key={m.group} id={m.group} mode={mode} setMode={setMode} />
        ))}
      </List>
      <Divider />
      <Box sx={{ px: 2, pt: 1.5 }}>
        <Typography fontWeight={700} color="primary">
          {mode.mode === GroupsModes.NEW ? "New Group" : `Add Member`}
        </Typography>
      </Box>

      {mode.mode === GroupsModes.NEW ? (
        <OutlinedInput
          fullWidth
          placeholder="Name"
          autoFocus={true}
          value={newGroupName}
          onChange={(event) => setNewGroupName(event.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                edge="end"
                sx={{ marginRight: "12px" }}
                size="small"
                color="primary"
                onClick={createGroup}
              >
                <Add />
              </IconButton>
            </InputAdornment>
          }
        />
      ) : null}

      {mode.group?.id ? <EditGroup id={mode.group.id} mode={mode} /> : null}
    </Box>
  );
}
