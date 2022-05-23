import { Clear } from "@mui/icons-material";
import {
  Box,
  OutlinedInput,
  InputAdornment,
  IconButton,
  ListItem,
  ListItemText,
  List,
} from "@mui/material";
import React from "react";
import { getFeatureLayers } from "../../../factories/esri/helpers";
import { Modes } from "../Control";
import { FaCampground } from "react-icons/fa";

interface IProps {
  view: __esri.MapView;
  setWhatWords(words: string): void;
  setMode(newMode: Modes): void;
}

export default function Search(props: IProps) {
  const [search, setSearch] = React.useState<string>("");

  const [loadedFeatures, setLoadedFeatures] = React.useState<__esri.Graphic[]>(
    []
  );

  const queryFeatures = React.useCallback(async () => {
    const [layer] = getFeatureLayers(props.view, ["sites"]);

    const { features } = await layer.queryFeatures();

    setLoadedFeatures(features);
  }, [props.view]);

  React.useEffect(() => {
    queryFeatures();
  }, [queryFeatures]);

  return (
    <Box>
      <Box
        display={"flex"}
        alignItems="center"
        sx={{ borderBottom: "1px solid lightgray" }}
      >
        <OutlinedInput
          fullWidth
          placeholder="Search"
          autoFocus={true}
          sx={{ padding: "4px 12px" }}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="search"
                edge="end"
                sx={{ marginRight: "7px" }}
                size="small"
                onClick={() => props.setMode(Modes.NONE)}
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          }
        />
      </Box>
      <Box
        sx={{
          maxHeight: 250,
          backgroundColor: "#f2f4f5",
          overflowY: "scroll",
        }}
      >
        <List sx={{ p: 0 }}>
          {loadedFeatures
            .filter((lf) => lf.attributes.title.includes(search))
            .map((lf) => (
              <ListItem
                sx={{
                  ":hover": {
                    backgroundColor: "#fafafa",
                    cursor: "pointer",
                  },
                }}
                onClick={() => {
                  props.view.goTo(lf.geometry);

                  props.setWhatWords(lf.attributes.words);

                  props.setMode(Modes.NAVIGATE);
                }}
              >
                <FaCampground
                  style={{ color: "lightgray", fontSize: "20px" }}
                />
                <ListItemText
                  sx={{ ml: 2 }}
                  primary={lf.attributes.title}
                  secondary={lf.attributes.words}
                />
              </ListItem>
            ))}
        </List>
      </Box>
    </Box>
  );
}
