import MapView from "@arcgis/core/views/MapView";
import ArcGISMap from "@arcgis/core/Map";
import React from "react";
import esriConfig from "@arcgis/core/config";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Point from "@arcgis/core/geometry/Point";

/**
 * Custom hook to create a view from a webmap
 * @param map - webmap properties
 * @param options
 * @returns ref to be passed map container/div, mapview
 */
export function useWebMap(
  map?: __esri.WebMapProperties,
  options?: __esri.MapViewProperties
) {
  // Create a ref to element to be used as the map's container
  const mapRef = React.useRef<HTMLDivElement>(null);
  // Hold on to the view in state
  const [view, setView] = React.useState<__esri.MapView>();

  React.useEffect(() => {
    const defaultMap = new ArcGISMap({
      basemap: "streets-navigation-vector",
    });

    esriConfig.apiKey =
      "AAPKf1fadf47c87e4bd1abb01904a0ab03feTQSNGPtVsvkEVrWi4RcQfYNYvkApKW-iXRW13S5c7GNi_MN5Mgdt2sPeekWtLlPE";

    const mapView = new MapView({
      map: map || defaultMap,
      container: mapRef.current as HTMLDivElement,
      ...options,

      constraints: { minZoom: 12 },
      center: [-2.58791, 51.454514],
      spatialReference: {
        wkid: 3857,
      },
    });

    mapView.when(() => {
      setView(mapView);

      const renderer = {
        type: "simple",
        symbol: {
          type: "picture-marker",
          url: "http://static.arcgis.com/images/Symbols/NPS/npsPictograph_0231b.png",
          width: "18px",
          height: "18px",
        },
      };

      const layer = new FeatureLayer({
        url: "https://services7.arcgis.com/AE6LrdSL5QdoWEcC/arcgis/rest/services/sites/FeatureServer/0",
        spatialReference: {
          wkid: 3857,
        },
        renderer: renderer as any,
      });

      mapView.map.add(layer);
    });

    return function cleanUp() {
      mapView.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { mapRef, view };
}

/**
 * State returned from useDrawPoint()
 */
type DrawPointState = {
  event: __esri.EventHandler | null;
  activate(): void;
  deactivate(): void;
};

/**
 * Hook to draw a point on the map
 * @param view - the mapview
 * @param isSelected - start tool on component mount?
 * @param onDrawPoint - handler for draw complete
 */
export function useDrawPoint(
  view: __esri.MapView | undefined,
  isSelected: boolean,
  onDrawPoint: (point: __esri.Point) => void
): DrawPointState {
  const [event, setEvent] = React.useState<__esri.EventHandler | null>(null);
  const [active, setActive] = React.useState<boolean>(isSelected);

  const activate = () => setActive(true);
  const deactivate = () => setActive(false);

  React.useEffect(() => {
    const handleDraw = (event: any) => {
      setEvent(event);
      const point = new Point({
        x: event.mapPoint.x,
        y: event.mapPoint.y,
        spatialReference: { wkid: 3857 },
      });

      onDrawPoint(point);
      deactivate();
    };

    // Get the map surface
    const surface = (view as any)?.surface;
    let handle: IHandle;

    if (active && view) {
      // Allow user to draw when select mode or they are viewing a form
      view.popup.autoOpenEnabled = false;
      handle = view.on("click", handleDraw);

      // Set draw mode and cursor as draw tool doesn't set the cursor
      surface.style.cursor = "crosshair";
    }

    return function cleanup() {
      if (view) {
        view.popup.autoOpenEnabled = true;

        // Clean
        handle?.remove();

        // Reset to default cursor
        surface.style.cursor = "";
      }
    };
  }, [view, active, onDrawPoint]);

  return { event, activate, deactivate };
}
