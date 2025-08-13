import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";

// Firebase configuration with actual credentials
const firebaseConfig = {
  apiKey: "AIzaSyBHZR3etA6uUi4dWwKCykhoUJofWUAAVck",
  authDomain: "snapfolio-b3d42.firebaseapp.com",
  projectId: "snapfolio-b3d42",
  storageBucket: "snapfolio-b3d42.firebasestorage.app",
  messagingSenderId: "443522586422",
  appId: "1:443522586422:web:66b629a0185fba8fda8597",
  measurementId: "G-JVKLNJKZV2",
};

// Initialize Firebase
let app;
let auth: Auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);

  console.log("Firebase initialized successfully");
  console.log("App:", app);
  console.log("Auth:", auth);

  // Test Google provider creation
  try {
    const provider = new GoogleAuthProvider();
    console.log("Google provider created successfully");
  } catch (providerError) {
    console.error("Google provider creation failed:", providerError);
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
  // Create a mock auth object for fallback
  auth = {} as Auth;
}

export { auth };
export default app;
