import { Logout } from "@mui/icons-material";
import { TextField, MenuItem, Paper, Button } from "@mui/material";
import { getAuth, signOut, User } from "firebase/auth";
import { where } from "firebase/firestore";
import React from "react";
import { getFeatureLayers } from "../../../factories/esri/helpers";
import { useLiveDocuments } from "../../../factories/utils/hooks";
import { app } from "../../../firebase-config";
import { IMembership } from "../../../shared/types";

const styles = {
  container: {
    position: "absolute",
    backgroundColor: "white",
    bottom: 24,
    left: 15,
    display: "flex",
    borderRadius: 0,
  },
};

interface IProps {
  view: __esri.MapView;
  user: User;
  currentGroup: string;
  setCurrentGroup(newGroup: string): void;
}

export default function GroupControl(props: IProps) {
  const myMemberships = useLiveDocuments<IMembership>({
    collectionName: "memberships",
    queryConstraints: [where("user", "==", props.user.email)],
  });

  React.useEffect(() => {
    if (props.currentGroup === "" && myMemberships.length !== 0) {
      props.setCurrentGroup(myMemberships[0].group);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myMemberships]);

  React.useEffect(() => {
    const [f] = getFeatureLayers(props.view, ["sites"]);

    f.definitionExpression = `GroupID = '${props.currentGroup}'`;
  }, [props.currentGroup, props.view]);

  return (
    <Paper sx={styles.container}>
      <TextField
        fullWidth
        focused={true}
        select
        value={props.currentGroup}
        onChange={(event) => props.setCurrentGroup(event.target.value)}
        sx={{ width: 200 }}
      >
        {myMemberships.map((m) => (
          <MenuItem key={m.group} value={m.group}>
            {m.groupName}
          </MenuItem>
        ))}
      </TextField>
      <Button
        startIcon={<Logout />}
        variant="contained"
        onClick={() => signOut(getAuth(app))}
        color="secondary"
        sx={{ display: "flex", borderRadius: 0, width: 150 }}
      >
        Sign out
      </Button>
    </Paper>
  );
}
