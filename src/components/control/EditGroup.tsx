import { Add } from "@mui/icons-material";
import {
  OutlinedInput,
  InputAdornment,
  IconButton,
  Divider,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import { where } from "firebase/firestore";
import React from "react";
import { FirestoreDB } from "../../factories/firestore/firestore";
import { useLiveDocuments } from "../../factories/utils/hooks";
import { IMembership } from "../../shared/types";
import { GroupsMode } from "./Groups";

interface IProps {
  mode: GroupsMode;
}

export default function EditGroup(props: IProps) {
  const groupMembers = useLiveDocuments<IMembership>({
    collectionName: "memberships",
    queryConstraints: [where("group", "==", props.mode.group?.id)],
  });

  const [email, setEmail] = React.useState<string>("");

  const db = React.useMemo(() => new FirestoreDB(), []);

  const createMembership = () => {
    if (props.mode.group?.id) {
      try {
        db.createMembership({ group: props.mode.group?.id, user: email });
        setEmail("");
      } catch (error) {
        console.warn(error);
      }
    }
  };

  return (
    <>
      <OutlinedInput
        fullWidth
        placeholder="yourfriend@email.com"
        autoFocus={true}
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="Add User"
              edge="end"
              sx={{ marginRight: "12px" }}
              size="small"
              color="primary"
              onClick={createMembership}
            >
              <Add />
            </IconButton>
          </InputAdornment>
        }
      />

      <Divider />
      <Box sx={{ px: 2, pt: 1.5 }}>
        <Typography fontWeight={700} color="primary">
          {`Members (${groupMembers.length})`}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          overflowX: "scroll",
          listStyle: "none",
          p: 1.5,
          m: 0,
        }}
        component="ul"
      >
        {groupMembers.map((data) => {
          return (
            <Chip
              label={data.user}
              sx={{ mr: 0.3 }}
              variant="outlined"
              color="secondary"
              onDelete={() => ""}
            />
          );
        })}
      </Box>
    </>
  );
}
