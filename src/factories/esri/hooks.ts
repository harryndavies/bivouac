import MapView from "@arcgis/core/views/MapView";
import React from "react";
import esriConfig from "@arcgis/core/config";
import Point from "@arcgis/core/geometry/Point";
import WebMap from "@arcgis/core/WebMap";
import Locate from "@arcgis/core/widgets/Locate";

/**
 * Creates a locate widget for the view
 * @param view - the mapview
 * @param position - the ui position
 */
function addLocate(view: MapView, position: string) {
  if (view !== null && view.ui !== null) {
    const locateWidget = new Locate({
      view: view,
    });

    view.ui.add(locateWidget, position);
  }
}

/**
 * Custom hook to create a view from a webmap
 * @param map - webmap properties
 * @param options
 * @returns ref to be passed map container/div, mapview
 */
export function useWebMap(options?: __esri.MapViewProperties) {
  // Create a ref to element to be used as the map's container
  const mapRef = React.useRef<HTMLDivElement>(null);
  // Hold on to the view in state
  const [view, setView] = React.useState<__esri.MapView>();

  React.useEffect(() => {
    esriConfig.apiKey = process.env.REACT_APP_ESRIAPI || "";

    const webmap = new WebMap({
      portalItem: {
        id: "b6d734fd320d43c0ad673c09e0878c28",
      },
    });

    const mapView = new MapView({
      map: webmap,
      container: mapRef.current as HTMLDivElement,
      ...options,
      center: [-2.58791, 51.454514],
      spatialReference: {
        wkid: 3857,
      },
      ui: { components: ["attribution"] },
    });

    mapView.when(() => {
      setView(mapView);
      addLocate(mapView, "bottom-right");
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

    if (!view || !active) {
      return;
    }

    // Get the map surface
    const surface = (view as any)?.surface;

    // Allow user to draw when select mode or they are viewing a form
    view.popup.autoOpenEnabled = false;
    view.on("click", handleDraw);

    // Set draw mode and cursor as draw tool doesn't set the cursor
    surface.style.cursor = "grab";
  }, [view, active, onDrawPoint]);

  return { event, activate, deactivate };
}
