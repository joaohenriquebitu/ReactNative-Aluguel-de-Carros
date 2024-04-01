import { StatusBar } from "expo-status-bar";
import StackComponent from "./routes/stack";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "./src/UserContext";
import { useEffect } from "react";
import { auth } from "./src/firebaseConfig";
import { Appearance } from "react-native";
import { UserProvider } from "./src/UserContext";
export default function App(){

  useEffect(() => Appearance.setColorScheme('light'),
  [])

  return (
  <UserProvider>
  <SafeAreaProvider>
    

  <StackComponent />
  
  </SafeAreaProvider>
  </UserProvider>
  );
}