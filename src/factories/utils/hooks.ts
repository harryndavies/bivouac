import React from "react";
import {
  collection,
  getFirestore,
  query,
  QueryConstraint,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { app } from "../../firebase-config";

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>; // Return success

function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = React.useState<CopiedValue>(null);

  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.warn("Copy failed", error);
      setCopiedText(null);
      return false;
    }
  };

  return [copiedText, copy];
}

export { useCopyToClipboard };

/**
 * Custom hook to retrieve document and listen for changes
 * @param params { collectionName, queryConstraints }
 * @returns the documents
 */
export function useLiveDocuments<T>(params: {
  collectionName: string;
  queryConstraints: QueryConstraint[];
}) {
  const q = React.useMemo(() => {
    const db = getFirestore(app);

    const ref = collection(db, params.collectionName);

    return query(ref, ...params.queryConstraints);
  }, [params.queryConstraints, params.collectionName]);

  const [snapshot] = useCollection(q);

  const documents = snapshot
    ? snapshot.docs.map((d) => {
        const document = { ...d.data(), id: d.id } as unknown as T;
        return document;
      })
    : [];

  return documents;
}
