import {
  Box,
  Button,
  Collapse,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import Graphic from "@arcgis/core/Graphic";
import { createFeature } from "../../factories/esri/helpers";
import { useDrawPoint } from "../../factories/esri/hooks";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { GiCampingTent } from "react-icons/gi";
import { useAuthState } from "react-firebase-hooks/auth";

import {
  Add,
  Clear,
  ContentCopy,
  Directions,
  Group,
  SearchOutlined,
  StarOutline,
} from "@mui/icons-material";
import { useCopyToClipboard } from "../../factories/utils/hooks";
import Point from "@arcgis/core/geometry/Point";
import Navigate from "./Navigate";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import New from "./New";
import Groups from "./Groups";
import Auth from "./Auth";
import { getAuth } from "firebase/auth";
import { app } from "../../firebase-config";
import LoadingButton from "@mui/lab/LoadingButton";

const styles = {
  container: {
    width: 400,
    position: "absolute",
    backgroundColor: "white",
    top: 15,
    right: 15,
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
  latitude: 51.473251,
  longitude: -2.5871231,
});

const initWords = "dance.copy.solar";

export enum Modes {
  GROUPS,
  NAVIGATE,
  NEW,
  AUTH,
  SEARCH,
}

interface IProps {
  view: __esri.MapView;
}

export default function Control(props: IProps) {
  const [loggedIn] = useAuthState(getAuth(app));

  const [point, setPoint] = React.useState<__esri.Point>(initPoint);

  const [loading, setLoading] = React.useState<boolean>(false);

  const [mode, setMode] = React.useState<Modes>(Modes.NEW);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [value, copy] = useCopyToClipboard();

  const [whatWords, setWhatWords] = React.useState<string>(initWords);

  const getThreeWords = async (point: __esri.Point): Promise<void> => {
    const response =
      await fetch(`https://api.what3words.com/v3/convert-to-3wa?key=${process.env.REACT_APP_WHAT3WORDS}&coordinates=${point.latitude}%2C${point.longitude}&language=en&format=json
      `);

    const { words } = await response.json();

    setWhatWords(words);
  };

  const tempGraphicsLayer = React.useMemo(() => new GraphicsLayer(), []);

  React.useEffect(() => {
    if (props.view) {
      props.view.map?.layers.add(tempGraphicsLayer);
    }
  }, [props.view, tempGraphicsLayer]);

  const onDrawComplete = async (point: __esri.Point) => {
    setMode(Modes.NEW);

    tempGraphicsLayer.removeAll();

    var symbol = new SimpleMarkerSymbol({
      style: "square",
      size: 11.5,
      outline: { color: "red" },
    });

    tempGraphicsLayer.add(new Graphic({ geometry: point, symbol: symbol }));

    setPoint(point);

    activate();
  };

  React.useEffect(() => {
    getThreeWords(point);
  }, [point]);

  const isActiveByDefault = true;

  const { activate } = useDrawPoint(
    props.view,
    isActiveByDefault,
    onDrawComplete
  );

  /**
   * Handles the creation of a new site feature
   */
  const createSite = async () => {
    if (props.view) {
      tempGraphicsLayer.removeAll();

      setLoading(true);
      const pointGraphic = new Graphic({
        attributes: { words: whatWords },
        geometry: point,
      });

      await createFeature(props.view, "sites", pointGraphic);
      setLoading(false);
    }
  };

  function renderTools(): JSX.Element {
    return (
      <>
        <Box
          sx={{ p: 1.5 }}
          display="flex"
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Box display="flex" alignItems={"center"}>
            <Box
              style={{ fontSize: "28px", color: "#007f5f" }}
              display="flex"
              alignItems={"center"}
            >
              <GiCampingTent />
            </Box>
            <Typography
              fontSize={"20px"}
              fontWeight={600}
              sx={{ p: 0, m: 0, ml: 1, color: "#0A3049" }}
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

            <IconButton
              aria-label="copy"
              size="medium"
              color="primary"
              onClick={() => setMode(Modes.SEARCH)}
            >
              <SearchOutlined fontSize="inherit" />
            </IconButton>
          </Box>
        </Box>

        <Box display={"flex"}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Directions />}
            color={mode === Modes.NAVIGATE ? "secondary" : "primary"}
            sx={styles.button}
            onClick={() => setMode(Modes.NAVIGATE)}
          >
            Navigate
          </Button>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Group />}
            sx={styles.button}
            color={mode === Modes.GROUPS ? "secondary" : "primary"}
            onClick={() => setMode(Modes.GROUPS)}
          >
            Groups
          </Button>
          {!loading ? (
            <Button
              variant="contained"
              color={mode === Modes.NEW ? "secondary" : "primary"}
              fullWidth
              startIcon={
                mode === Modes.NEW && loggedIn ? <StarOutline /> : <Add />
              }
              sx={styles.button}
              onClick={() =>
                mode === Modes.NEW && loggedIn
                  ? createSite()
                  : setMode(Modes.NEW)
              }
            >
              {mode === Modes.NEW && loggedIn ? "Save" : "New"}
            </Button>
          ) : (
            <LoadingButton
              loading={loading}
              loadingPosition="start"
              startIcon={<StarOutline />}
              variant="contained"
              fullWidth
            >
              Save
            </LoadingButton>
          )}
        </Box>

        <Collapse in={mode === Modes.NAVIGATE}>
          <Navigate point={point} words={whatWords} />
        </Collapse>

        <Collapse in={mode === Modes.NEW}>
          {loggedIn ? <New user={loggedIn} /> : <Auth setMode={setMode} />}
        </Collapse>

        <Collapse in={mode === Modes.GROUPS}>
          {loggedIn ? <Groups user={loggedIn} /> : <Auth setMode={setMode} />}
        </Collapse>
      </>
    );
  }

  function renderSearch(): JSX.Element {
    return (
      <Box>
        <Box display={"flex"} alignItems="center">
          <OutlinedInput
            fullWidth
            placeholder="Search"
            autoFocus={true}
            sx={{ padding: "4px 12px" }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  edge="end"
                  sx={{ marginRight: "12px" }}
                  onClick={() => setMode(Modes.NEW)}
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            }
          />
        </Box>
        <Box sx={{ height: 166, backgroundColor: "#f2f4f5" }}></Box>
      </Box>
    );
  }

  return (
    <Paper sx={styles.container}>
      {mode === Modes.SEARCH ? renderSearch() : renderTools()}
    </Paper>
  );
}
