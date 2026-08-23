import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "../firebase/client";

/**
 * Public marker document that tells the sign-in / landing pages whether the very
 * first super administrator already exists. It is world-readable (see
 * firestore.rules) so the "First-time setup" entry point can disappear for
 * visitors who are not signed in.
 */
const BOOTSTRAP_DOC = () => doc(firestore(), "system", "bootstrap");

export async function isBootstrapped(): Promise<boolean> {
  try {
    const snap = await getDoc(BOOTSTRAP_DOC());
    return snap.exists() && snap.data()?.["completed"] === true;
  } catch {
    // Permission or network problems must never hide the setup entry point.
    return false;
  }
}

export async function markBootstrapped(adminUid: string, adminEmail: string) {
  await setDoc(
    BOOTSTRAP_DOC(),
    { completed: true, adminUid, adminEmail, completedAt: serverTimestamp() },
    { merge: true },
  );
}
