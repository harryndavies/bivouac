import { User } from "firebase/auth";
import { where } from "firebase/firestore";
import React from "react";
import { getFeatureLayers } from "../../factories/esri/helpers";
import { useLiveDocuments } from "../../factories/utils/hooks";
import { IMembership } from "../../shared/types";

/**
 * Custom hook to determine whether any features are visibile on application start.
 * @param view - the mapview
 * @param user - the current user
 */
export const useInitFeatureVisibility = (
  view: __esri.MapView | undefined,
  user: User | null | undefined
) => {
  React.useEffect(() => {
    if (view) {
      const [l] = getFeatureLayers(view, ["sites"]);

      if (!user) {
        l.definitionExpression = "1 = 2";
      } else {
        l.definitionExpression = "1 = 1";
      }
    }
  }, [view, user]);
};

/**
 * Custom hook to get the current user's group
 * @param view - the mapview
 * @param userEmail - the current user email
 * @returns the user's current group, fn to set the user's current group
 */
export const useCurrentGroup = (
  view: __esri.MapView | undefined,
  userEmail: string
) => {
  const [currentGroup, setCurrentGroup] = React.useState<string>("");

  const myMemberships = useLiveDocuments<IMembership>({
    collectionName: "memberships",
    queryConstraints: [where("user", "==", userEmail)],
  });

  React.useEffect(() => {
    if (currentGroup === "" && myMemberships.length !== 0) {
      setCurrentGroup(myMemberships[0].group);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myMemberships]);

  React.useEffect(() => {
    if (view) {
      const [f] = getFeatureLayers(view, ["sites"]);

      f.definitionExpression = `GroupID = '${currentGroup}'`;

      view.popup.close();
    }
  }, [currentGroup, view]);

  return { currentGroup, setCurrentGroup };
};

/**
 * Custom hook to create a feature popup on hover
 * @param view - the mapview
 */
export const usePopupOnViewClick = (view: __esri.MapView) => {
  React.useEffect(() => {
    view.on("click", function (event) {
      view.hitTest(event).then(function (response) {
        if (response.results.length) {
          var graphic = response.results[0].graphic;
          view.popup.open({
            location: (graphic.geometry as any).centroid,
            features: [graphic],
          });
        } else {
          view.popup.close();
        }
      });
    });
  }, [view]);
};
