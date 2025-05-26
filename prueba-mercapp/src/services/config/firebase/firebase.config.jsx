// // Tu objeto de configuración de Firebase
// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getDatabase } from 'firebase/database';

// import { getAnalytics } from "firebase/analytics";

// import Config from 'react-native-config';
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: Config.FB_API_KEY,
//   authDomain: `${Config.P_ID}.firebaseapp.com`,
//   databaseURL: Config.DB_URL,
//   projectId: `${Config.P_ID}`,
//   storageBucket: `${Config.P_ID}.firebasestorage.app`,
//   messagingSenderId: Config.MS_ID,
//   appId: Config.ID,
//   measurementId: Config.M_ID
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const db = getDatabase(app);
// export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// export default app;
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';
// import { Config } from 'react-native-config';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgSQF9HN4sCbxJFjCf74a2-44otv38OVU",
  authDomain: "mercapp-77.firebaseapp.com",
  databaseURL: "https://mercapp-77-default-rtdb.firebaseio.com",
  projectId: "mercapp-77",
  storageBucket: "mercapp-77.firebasestorage.app",
  messagingSenderId: "491178304722",
  appId: "1:491178304722:web:d24bf7c7100811ee5a390b",
  // measurementId: "G-WR7NVV9ENL"
};

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FB_API_KEY,
//   authDomain: `${process.env.REACT_APP_P_ID}.firebaseapp.com`,
//   databaseURL: process.env.REACT_APP_DB_URL,
//   projectId: `${process.env.REACT_APP_P_ID}`,
//   storageBucket: `${process.env.REACT_APP_P_ID}.firebasestorage.app`,
//   messagingSenderId: process.env.REACT_APP_MS_ID,
//   appId: process.env.REACT_APP_APP_ID,
//   measurementId: process.env.REACT_APP_M_ID
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getDatabase(app);