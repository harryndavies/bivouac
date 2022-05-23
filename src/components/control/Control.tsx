import {
  Box,
  Button,
  Collapse,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import Graphic from "@arcgis/core/Graphic";
import { useDrawPoint } from "../../factories/esri/hooks";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { useAuthState } from "react-firebase-hooks/auth";

import { Add, Directions, Group, SearchOutlined } from "@mui/icons-material";
import Point from "@arcgis/core/geometry/Point";
import Navigate from "./navigate/Navigate";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import New from "./new/New";
import Groups from "./groups/Groups";
import Auth from "../authentication/Auth";
import { getAuth } from "firebase/auth";
import { app } from "../../firebase-config";
import Search from "./search/Search";
import { usePopupOnViewClick } from "../hooks/hooks";

const styles = {
  button: {
    height: "100%",
    borderRadius: 0,
    boxShadow: 0,
    py: 1.5,
    fontWeight: 550,
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
  NONE,
}

interface IProps {
  view: __esri.MapView;
  currentGroup: string;
  setCurrentGroup(newGroup: string): void;
}

export default function Control(props: IProps): JSX.Element {
  const [loggedIn] = useAuthState(getAuth(app));

  const [point, setPoint] = React.useState<__esri.Point>(initPoint);

  const [mode, setMode] = React.useState<Modes>(Modes.NONE);

  const [whatWords, setWhatWords] = React.useState<string>(initWords);

  usePopupOnViewClick(props.view);

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
    tempGraphicsLayer.removeAll();

    setMode(Modes.NONE);

    const symbol = new SimpleMarkerSymbol({
      style: "circle",
      size: 6,
      outline: { color: "#282828" },
    });

    tempGraphicsLayer.add(new Graphic({ geometry: point, symbol: symbol }));

    props.view.goTo(point);

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
              style={{ fontSize: "28px", color: "#1e1f27" }}
              display="flex"
              alignItems={"center"}
            >
              {`///`}
            </Box>
            <Typography
              fontSize={"24px"}
              fontWeight={600}
              sx={{ p: 0, m: 0, ml: 0.2, color: "#0A3049" }}
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

          <Button
            variant="contained"
            color={mode === Modes.NEW ? "secondary" : "primary"}
            fullWidth
            startIcon={<Add />}
            sx={styles.button}
            onClick={() => setMode(Modes.NEW)}
          >
            New
          </Button>
        </Box>

        <Collapse in={mode === Modes.NAVIGATE}>
          <Navigate point={point} words={whatWords} />
        </Collapse>

        <Collapse in={mode === Modes.NEW}>
          {loggedIn ? (
            <New
              user={loggedIn}
              point={point}
              words={whatWords}
              view={props.view}
              tempGraphicsLayer={tempGraphicsLayer}
              currentGroup={props.currentGroup}
            />
          ) : (
            <Auth setMode={setMode} />
          )}
        </Collapse>

        <Collapse in={mode === Modes.GROUPS}>
          {loggedIn ? (
            <Groups
              user={loggedIn}
              currentGroup={props.currentGroup}
              setCurrentGroup={props.setCurrentGroup}
            />
          ) : (
            <Auth setMode={setMode} />
          )}
        </Collapse>
      </>
    );
  }

  return (
    <Paper
      sx={{
        width: {
          xs: "92vw",
          sm: "92vw",
          md: 400,
        },
        left: { xs: "50%", sm: "50%", md: "1%" },
        transform: {
          xs: "translate(-50%, 0)",
          sm: "translate(-50%, 0)",
          md: "none",
        },
        marginTop: 1.8,
        backgroundColor: "white",
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 0,
      }}
    >
      {mode === Modes.SEARCH ? (
        <Search
          view={props.view}
          setMode={setMode}
          setWhatWords={setWhatWords}
        />
      ) : (
        renderTools()
      )}
    </Paper>
  );
}
