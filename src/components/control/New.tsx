import Graphic from "@arcgis/core/Graphic";
import { Box, Button, Grid, MenuItem, TextField } from "@mui/material";
import { User } from "firebase/auth";
import { where } from "firebase/firestore";
import React from "react";
import { createFeature } from "../../factories/esri/helpers";
import { useLiveDocuments } from "../../factories/utils/hooks";
import { IMembership, ISite } from "../../shared/types";

interface IProps {
  view: __esri.MapView;
  point: __esri.Point;
  words: string;
  user: User;
  tempGraphicsLayer: __esri.GraphicsLayer;
}

export default function New(props: IProps): JSX.Element {
  const myMemberships = useLiveDocuments<IMembership>({
    collectionName: "memberships",
    queryConstraints: [where("user", "==", props.user.email)],
  });

  const [group, setGroup] = React.useState("");

  /**
   * Handles the creation of a new site feature
   */
  const createSite = async () => {
    if (props.view) {
      props.tempGraphicsLayer.removeAll();

      const newSiteAttributes: ISite = { words: props.words, GroupID: group };

      const pointGraphic = new Graphic({
        attributes: newSiteAttributes,
        geometry: props.point,
      });

      await createFeature(props.view, "sites", pointGraphic);
    }
  };

  return (
    <Box sx={{ p: 1.5 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            focused={true}
            select
            value={group}
            onChange={(event) => setGroup(event.target.value)}
            helperText="Please select a group"
          >
            {myMemberships.map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.group}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            onClick={createSite}
            disabled={group === ""}
            variant="outlined"
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
