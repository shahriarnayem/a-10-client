"use client";
 
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "@/lib/firebase";
import { exchangeFirebaseToken } from "@/lib/authApi";
 
const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();
 
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [marketplaceUser, setMarketplaceUser] = useState(null);
  const [loading, setLoading] = useState(true);
 
  async function syncSession(currentUser) {
    const idToken = await currentUser.getIdToken(true);
    const session = await exchangeFirebaseToken(idToken);
    sessionStorage.setItem("aiPromptMarketplaceToken", session.token);
    setMarketplaceUser(session.user);
    return session;
  }
 
  useEffect(() => {
    let unsubscribe = () => {};
 
    setPersistence(auth, browserLocalPersistence).then(() => {
      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
 
        if (currentUser) {
          await syncSession(currentUser);
        } else {
          sessionStorage.removeItem("aiPromptMarketplaceToken");
          setMarketplaceUser(null);
        }
 
        setLoading(false);
      });
    });
 
    return () => unsubscribe();
  }, []);
 
  async function registerUser({ name, email, password, photoURL }) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name, photoURL: photoURL || null });
    await credential.user.reload();
    await syncSession(auth.currentUser);
    return auth.currentUser;
  }
 
  async function loginUser(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await syncSession(credential.user);
    return credential.user;
  }
 
  async function googleLogin() {
    const credential = await signInWithPopup(auth, googleProvider);
    await syncSession(credential.user);
    return credential.user;
  }
 
  async function logoutUser() {
    await signOut(auth);
    sessionStorage.removeItem("aiPromptMarketplaceToken");
  }
 
  const value = useMemo(
    () => ({ user, marketplaceUser, loading, registerUser, loginUser, googleLogin, logoutUser }),
    [user, marketplaceUser, loading],
  );
 
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
 
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
