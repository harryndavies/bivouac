export enum EditFeatureMode {
  CREATE = "addFeatures",
  EDIT = "updateFeatures",
  DELETE = "deleteFeatures",
}

/**
 * Response from apply edits
 */
type EditFeatureResult = {
  updateFeatureResults: __esri.FeatureEditResult[];
  addFeatureResults: __esri.FeatureEditResult[];
  deleteFeatureResults: __esri.FeatureEditResult[];
};

export function getFeatureLayers(
  view: __esri.MapView,
  layerTitles: string[]
): __esri.FeatureLayer[] {
  const layers: __esri.FeatureLayer[] = [];

  layerTitles.forEach((element) => {
    const layer = Array.from(view.map?.layers).find(
      (layer) => layer.title === element
    ) as __esri.FeatureLayer;

    if (layer) {
      layers.push(layer);
    }
  });

  return layers;
}

/**
 * Create, Edit or Delete a feature in a feature service. If editing an existing feature, the editGraphic fn can be used to prepare the graphic.
 * @param view - mapview
 * @param editMode - CREATE, EDIT or DELETE feature
 * @param layerTitle - title of feature layer
 * @param feature - feature to be created, edited or deleted
 * @returns - edit feature result, null if no layer found
 */
export async function editFeature(
  view: __esri.MapView,
  editMode: EditFeatureMode,
  layerTitle: string,
  feature: __esri.Graphic
): Promise<EditFeatureResult | null> {
  const [layer] = getFeatureLayers(view, [layerTitle]);

  if (layer) {
    return await layer.applyEdits(
      { [editMode]: [feature] },
      "original-and-current-features"
    );
  }
  return null;
}

/**
 * Create a feature in a feature service
 * @param view - mapview
 * @param layerTitle - title of feature layer
 * @param feature - feature to be created
 * @returns - edit feature result, null if no layer found
 */
export async function createFeature(
  view: __esri.MapView,
  layerTitle: string,
  feature: __esri.Graphic
): Promise<EditFeatureResult | null> {
  return await editFeature(view, EditFeatureMode.CREATE, layerTitle, feature);
}

/**
 * Update a feature in a feature service
 * @param view - mapview
 * @param layerTitle - title of feature layer
 * @param feature - feature to be updated
 * @returns - edit feature result, null if no layer found
 */
export async function updateFeature(
  view: __esri.MapView,
  layerTitle: string,
  feature: __esri.Graphic
): Promise<EditFeatureResult | null> {
  return await editFeature(view, EditFeatureMode.EDIT, layerTitle, feature);
}

/**
 * Delete a feature in a feature service
 * @param view - mapview
 * @param layerTitle - title of feature layer
 * @param feature - feature to be deleted
 * @returns - edit feature result, null if no layer found
 */
export async function deleteFeature(
  view: __esri.MapView,
  layerTitle: string,
  feature: __esri.Graphic
): Promise<EditFeatureResult | null> {
  return await editFeature(view, EditFeatureMode.DELETE, layerTitle, feature);
}
