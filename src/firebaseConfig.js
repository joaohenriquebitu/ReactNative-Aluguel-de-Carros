
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBpPbKEC9mDZ__a59vY5ef8VqQui8_9Nns",
  authDomain: "aluguel-de-carros-a3db4.firebaseapp.com",
  databaseURL: "https://aluguel-de-carros-a3db4-default-rtdb.firebaseio.com",
  projectId: "aluguel-de-carros-a3db4",
  storageBucket: "aluguel-de-carros-a3db4.appspot.com",
  messagingSenderId: "50136077193",
  appId: "1:50136077193:web:1eeb2502f2169d86210758",
  measurementId: "G-K7N2HDYV1D"
};


// Initialize Firebase

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = initializeAuth(firebaseApp, {
persistence: getReactNativePersistence(AsyncStorage),
});