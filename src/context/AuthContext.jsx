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
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "@/lib/firebase";
import { exchangeFirebaseToken } from "@/lib/authApi";
 
const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();
 
export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [marketplaceUser, setMarketplaceUser] = useState(null);
  const [marketplaceToken, setMarketplaceToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
 
  const syncMarketplaceSession = useCallback(async (currentUser) => {
    const firebaseIdToken = await currentUser.getIdToken(true);
    const session = await exchangeFirebaseToken(firebaseIdToken);
    sessionStorage.setItem("aiPromptMarketplaceToken", session.token);
    setMarketplaceToken(session.token);
    setMarketplaceUser(session.user);
    setAuthError("");
    return session;
  }, []);
 
  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};
 
    async function initializeAuthentication() {
      try {
        await setPersistence(auth, browserLocalPersistence);
        unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          if (!active) return;
          setFirebaseUser(currentUser);
          if (!currentUser) {
            sessionStorage.removeItem("aiPromptMarketplaceToken");
            setMarketplaceToken(null);
            setMarketplaceUser(null);
            setAuthError("");
            setLoading(false);
            return;
          }
          try {
            await syncMarketplaceSession(currentUser);
          } catch (error) {
            if (active) {
              sessionStorage.removeItem("aiPromptMarketplaceToken");
              setMarketplaceToken(null);
              setMarketplaceUser(null);
              setAuthError(error.message);
            }
          } finally {
            if (active) setLoading(false);
          }
        });
      } catch (error) {
        if (active) {
          setAuthError(error.message);
          setLoading(false);
        }
      }
    }
 
    initializeAuthentication();
    return () => { active = false; unsubscribe(); };
  }, [syncMarketplaceSession]);
 
  async function registerUser({ name, email, password, photoURL }) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name, photoURL: photoURL || null });
    await credential.user.reload();
    await syncMarketplaceSession(auth.currentUser);
    return auth.currentUser;
  }
 
  async function loginUser(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await syncMarketplaceSession(credential.user);
    return credential.user;
  }
 
  async function googleLogin() {
    const credential = await signInWithPopup(auth, googleProvider);
    await syncMarketplaceSession(credential.user);
    return credential.user;
  }
 
  async function logoutUser() {
    await signOut(auth);
    sessionStorage.removeItem("aiPromptMarketplaceToken");
    setMarketplaceToken(null);
    setMarketplaceUser(null);
  }
 
  async function refreshMarketplaceSession() {
    if (!auth.currentUser) return null;
    setLoading(true);
    try { return await syncMarketplaceSession(auth.currentUser); }
    finally { setLoading(false); }
  }
 
  const value = useMemo(() => ({
    user: firebaseUser,
    firebaseUser,
    profile: marketplaceUser,
    marketplaceUser,
    marketplaceToken,
    loading,
    authError,
    registerUser,
    loginUser,
    googleLogin,
    logoutUser,
    logOut: logoutUser,
    refreshMarketplaceSession,
  }), [firebaseUser, marketplaceUser, marketplaceToken, loading, authError, syncMarketplaceSession]);
 
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
 
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
