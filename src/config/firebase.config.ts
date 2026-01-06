import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBYg58nMjuVv0FetDBtKifl5-7DtM4Z53k",
  authDomain: "ai-smart-campus-management.firebaseapp.com",
  projectId: "ai-smart-campus-management",
  storageBucket: "ai-smart-campus-management.firebasestorage.app",
  messagingSenderId: "593398594428",
  appId: "1:593398594428:web:754a3289996e92d3b0c2f9",
  measurementId: "G-42K08PXCX0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const storage = getStorage(app);

export default app;