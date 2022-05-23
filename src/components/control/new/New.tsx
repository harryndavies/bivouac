import Graphic from "@arcgis/core/Graphic";
import { Box, Button, Divider, Grid, TextField } from "@mui/material";
import { User } from "firebase/auth";
import React from "react";
import { createFeature } from "../../../factories/esri/helpers";
import { ISite } from "../../../shared/types";

interface IProps {
  view: __esri.MapView;
  point: __esri.Point;
  words: string;
  user: User;
  tempGraphicsLayer: __esri.GraphicsLayer;
  currentGroup: string;
}

export default function New(props: IProps): JSX.Element {
  const [title, setTitle] = React.useState<string>("");

  /**
   * Handles the creation of a new site feature
   */
  const createSite = async () => {
    if (props.view && props.currentGroup !== "" && title) {
      props.tempGraphicsLayer.removeAll();

      const newSiteAttributes: ISite = {
        title: title,
        words: props.words,
        GroupID: props.currentGroup,
      };

      const pointGraphic = new Graphic({
        attributes: newSiteAttributes,
        geometry: props.point,
      });

      await createFeature(props.view, "sites", pointGraphic);
    }
  };

  return (
    <Box>
      <Grid container>
        <Grid item xs={9}>
          <TextField
            placeholder="Title"
            fullWidth
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <Divider />
        </Grid>
        <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="contained"
            size="small"
            sx={{ borderRadius: 0 }}
            onClick={createSite}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
