import { NavigationContainer } from "@react-navigation/native";
import { NativeStackNavigationProp, createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Login from "../screens/Login";
import Home from "../screens/Home";
import SignUp from "../screens/SignUp";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { cor } from "../src/cor";
import Landing from "../screens/Landing";
import Account from "../screens/Account";
import { useState } from "react";
import { useEffect } from "react";
import { useUser } from "../src/UserContext";
import { PaperProvider } from "react-native-paper";
import Rental from "../screens/Rental";



export type StackNavigation = {
  Home: undefined;
  Login: undefined;
  Landing: undefined;
  Account: undefined;
  SignUp: undefined;
  Rental: {
    carSelected: string;
  }
};

const Stack = createNativeStackNavigator<StackNavigation>();

export type StackTypes = NativeStackNavigationProp<StackNavigation>;

export default function StackComponent() {
  const { updateUserDoc } = useUser();

  useEffect(() => {
    updateUserDoc();

    console.log("doc em teoria updated");
  }, []);

  const insets = useSafeAreaInsets();

  console.log("insets:", insets);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <StatusBar translucent={false} style="dark" backgroundColor="#F0F0F0" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={options} name="Landing" component={Landing} />
          <Stack.Screen options={options} name="Account" component={Account} />
          <Stack.Screen options={options} name="Home" component={Home} />
          <Stack.Screen options={options} name="SignUp" component={SignUp} />
          <Stack.Screen options={options} name="Login" component={Login} />
          <Stack.Screen options={options} name="Rental" component={Rental} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const options = {
  headerShown: false,
};
