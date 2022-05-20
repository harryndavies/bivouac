import Graphic from "@arcgis/core/Graphic";
import { Save } from "@mui/icons-material";
import { Box, Button, Grid } from "@mui/material";
import { User } from "firebase/auth";
import React from "react";
import { createFeature } from "../../factories/esri/helpers";
import { ISite } from "../../shared/types";

interface IProps {
  view: __esri.MapView;
  point: __esri.Point;
  words: string;
  user: User;
  tempGraphicsLayer: __esri.GraphicsLayer;
  currentGroup: string;
}

export default function New(props: IProps): JSX.Element {
  const [loading, setLoading] = React.useState(false);
  /**
   * Handles the creation of a new site feature
   */
  const createSite = async () => {
    if (props.view && props.currentGroup !== "") {
      setLoading(true);
      props.tempGraphicsLayer.removeAll();

      const newSiteAttributes: ISite = {
        words: props.words,
        GroupID: props.currentGroup,
      };

      const pointGraphic = new Graphic({
        attributes: newSiteAttributes,
        geometry: props.point,
      });

      await createFeature(props.view, "sites", pointGraphic);
      setLoading(false);
    }
  };

  return (
    <Box>
      <Grid item xs={12}>
        <Button
          fullWidth
          onClick={createSite}
          variant="contained"
          color="secondary"
          startIcon={<Save />}
          sx={{ borderRadius: 0 }}
          disabled={props.currentGroup === "" || loading}
        >
          Save
        </Button>
      </Grid>
    </Box>
  );
}
