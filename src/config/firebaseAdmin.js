import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { env } from "./env.js";
 
const firebaseAdminApp = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: env.firebaseProjectId,
        clientEmail: env.firebaseClientEmail,
        privateKey: env.firebasePrivateKey,
      }),
    });
 
export const firebaseAdminAuth = getAuth(firebaseAdminApp);
