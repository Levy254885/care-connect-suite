import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { firebaseAuth, firestore } from "./firebase/client";
import type { StaffUser } from "./types";

interface AuthState {
  firebaseUser: FirebaseUser | null;
  profile: StaffUser | null;
  loading: boolean;
  profileMissing: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileMissing, setProfileMissing] = useState(false);

  async function loadProfile(user: FirebaseUser) {
    const snap = await getDoc(doc(firestore(), "users", user.uid));
    if (!snap.exists()) {
      setProfile(null);
      setProfileMissing(true);
      return;
    }
    const data = snap.data();
    setProfile({ id: snap.id, ...(data as Omit<StaffUser, "id">) });
    setProfileMissing(false);
    updateDoc(snap.ref, { lastActivityAt: serverTimestamp() }).catch(() => undefined);
  }

  useEffect(() => {
    const auth = firebaseAuth();
    setPersistence(auth, browserLocalPersistence).catch(() => undefined);
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          await loadProfile(user);
        } catch {
          setProfile(null);
          setProfileMissing(true);
        }
      } else {
        setProfile(null);
        setProfileMissing(false);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      firebaseUser,
      profile,
      loading,
      profileMissing,
      signIn: async (email, password) => {
        await signInWithEmailAndPassword(firebaseAuth(), email.trim(), password);
      },
      signOut: async () => {
        await fbSignOut(firebaseAuth());
      },
      resetPassword: async (email) => {
        await sendPasswordResetEmail(firebaseAuth(), email.trim());
      },
      refreshProfile: async () => {
        const user = firebaseAuth().currentUser;
        if (user) await loadProfile(user);
      },
    }),
    [firebaseUser, profile, loading, profileMissing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
