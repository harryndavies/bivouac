import { TextField, MenuItem, Paper } from "@mui/material";
import { User } from "firebase/auth";
import { where } from "firebase/firestore";
import React from "react";
import { getFeatureLayers } from "../../../factories/esri/helpers";
import { useLiveDocuments } from "../../../factories/utils/hooks";
import { IMembership } from "../../../shared/types";

const styles = {
  container: {
    position: "absolute",
    backgroundColor: "white",
    bottom: 24,
    left: 15,
    display: "flex",
    alignItems: "center",
    borderRadius: 0,
    pr: 1,
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
      {props.currentGroup !== "" ? (
        <TextField
          fullWidth
          focused={true}
          select
          value={props.currentGroup}
          onChange={(event) => props.setCurrentGroup(event.target.value)}
          sx={{ width: 200 }}
          disabled={myMemberships.length === 1}
        >
          {myMemberships.map((m) => (
            <MenuItem key={m.group} value={m.group}>
              {m.groupName}
            </MenuItem>
          ))}
        </TextField>
      ) : null}
    </Paper>
  );
}
