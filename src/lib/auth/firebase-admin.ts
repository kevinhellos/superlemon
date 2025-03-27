import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);

if (!serviceAccount) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not set");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const auth = admin.auth();
export const db = admin.firestore();