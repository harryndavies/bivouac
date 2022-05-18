import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import Graphic from "@arcgis/core/Graphic";
import { createFeature } from "../factories/esri/helpers";
import { useDrawPoint } from "../factories/esri/hooks";
import {
  Add,
  ContentCopy,
  Directions,
  Map,
  SearchOutlined,
  ShareOutlined,
  StarOutline,
} from "@mui/icons-material";
import { useCopyToClipboard } from "../factories/utils/hooks";
import Point from "@arcgis/core/geometry/Point";

const styles = {
  container: {
    width: 400,
    position: "absolute",
    backgroundColor: "white",
    top: 15,
    left: 15,
    boxShadow: 24,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  button: {
    height: "100%",
    borderRadius: 0,
    boxShadow: 0,
    py: 1.5,
    fontWeight: 550,
    textTransform: "none",
  },
};

const initPoint = new Point({
  x: -287996.30445662356,
  y: 6705436.397879595,
});

const initWords = "dance.copy.solar";

interface IProps {
  view: __esri.MapView;
}

export default function Create(props: IProps) {
  const [point, setPoint] = React.useState<__esri.Point>(initPoint);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [value, copy] = useCopyToClipboard();

  const [whatWords, setWhatWords] = React.useState<string>(initWords);

  const getThreeWords = async (point: __esri.Point) => {
    const response =
      await fetch(`https://api.what3words.com/v3/convert-to-3wa?key=LS1JCAD6&coordinates=${point.latitude}%2C${point.longitude}&language=en&format=json
      `);

    const { words } = await response.json();

    return words;
  };

  const onDrawComplete = async (point: __esri.Point) => {
    setPoint(point);

    const words = await getThreeWords(point);
    setWhatWords(words);

    activate();
  };

  const { activate } = useDrawPoint(props.view, true, onDrawComplete);

  const createSite = async (point: __esri.Point) => {
    if (props.view) {
      const pointGraphic = new Graphic({
        attributes: { title: "test" },
        geometry: point,
      });

      createFeature(props.view, "Sites", pointGraphic);
    }
  };

  return (
    <>
      <Box sx={styles.container}>
        <Box
          sx={{ p: 1.5 }}
          display="flex"
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Box display="flex" alignItems={"center"}>
            <Map color="secondary" fontSize="large" sx={{ mr: 0.5 }} />
            <Typography
              fontSize={"20px"}
              fontWeight={600}
              sx={{ p: 0, m: 0, color: "#0A3049" }}
            >
              {whatWords}
            </Typography>
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"flex-end"}
          >
            <IconButton
              aria-label="copy"
              size="medium"
              color="primary"
              onClick={() => copy(whatWords)}
            >
              <ContentCopy fontSize="inherit" />
            </IconButton>

            <IconButton aria-label="copy" size="medium" color="primary">
              <SearchOutlined fontSize="inherit" />
            </IconButton>
          </Box>
        </Box>

        <Box display={"flex"}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<ShareOutlined />}
            sx={styles.button}
          >
            Share
          </Button>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Directions />}
            sx={styles.button}
          >
            Navigate
          </Button>
          <Button
            variant="contained"
            fullWidth
            startIcon={<StarOutline />}
            sx={styles.button}
          >
            Save
          </Button>
        </Box>
      </Box>
    </>
  );
}
