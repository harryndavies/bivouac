import { Box, List } from "@mui/material";
import { User } from "firebase/auth";
import { where } from "firebase/firestore";
import React from "react";
import { useLiveDocuments } from "../../factories/utils/hooks";
import GroupItem from "./GroupItem";

interface IProps {
  user: User;
}

export default function Groups(props: IProps) {
  const memberships = useLiveDocuments<{ group: string }>({
    collectionName: "memberships",
    queryConstraints: [where("user", "==", props.user.email)],
  });

  return (
    <Box>
      <List sx={{ my: 0, py: 0 }}>
        {memberships.map((m) => (
          <GroupItem key={m.group} id={m.group} />
        ))}
      </List>
    </Box>
  );
}
