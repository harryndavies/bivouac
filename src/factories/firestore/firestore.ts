import {
  addDoc,
  collection,
  DocumentData,
  DocumentReference,
  getFirestore,
} from "firebase/firestore";
import { app } from "../../firebase-config";
import { IGroup, IMembership } from "../../shared/types";

/**
 * Class to handle the firestore database
 */
export class FirestoreDB {
  db;

  constructor() {
    this.db = getFirestore(app);
  }

  /**
   * Creates a new group
   * @param group - the new group data
   * @returns - the created group id
   */
  async createGroup(group: IGroup): Promise<DocumentReference<DocumentData>> {
    const groupID = await addDoc(collection(this.db, "groups"), {
      ...group,
    });

    if (groupID) {
      this.createMembership({
        group: groupID.id,
        user: group.admin,
        groupName: group.name,
      });
    }

    return groupID;
  }

  /**
   * Creates a new membership
   * @param group - the new membership data
   * @returns - the created membership id
   */
  async createMembership(
    membership: IMembership
  ): Promise<DocumentReference<DocumentData>> {
    const docRef = await addDoc(collection(this.db, "memberships"), {
      ...membership,
    });

    return docRef;
  }
}
