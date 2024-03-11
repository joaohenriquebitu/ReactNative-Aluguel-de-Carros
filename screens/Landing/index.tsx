import { Platform, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  Button,
  Card,
  Icon,
  IconButton,
  Text,
  Appbar,
  Portal,
  Modal,
  PaperProvider,
  List,
  ActivityIndicator,
  Drawer,
  Menu,
  Divider,
  Surface,
  BottomNavigation,
  TextInput,
} from "react-native-paper";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState, useEffect, useCallback } from "react";
import { auth } from "../../src/firebaseConfig";
import { useUser } from "../../src/UserContext";
import { StyleSheet } from "react-native";
import { cor } from "../../src/cor";
import DateTimePicker from "@react-native-community/datetimepicker";
import CardContent from "react-native-paper/lib/typescript/components/Card/CardContent";

const Tab = createBottomTabNavigator();

export default function Landing() {
  const navigation = useNavigation();
  const { isLoggedIn, userDoc, showAccount, setShowAccount } = useUser();

  useEffect(() => {}, []);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: "white" }}>
        <Appbar.Content title="Aluga" />

        {isLoggedIn ? (
          showAccount ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#d5d5d5",
                borderRadius: 50,
              }}
            >
              <Appbar.Action
                icon="chevron-right"
                mode="contained"
                containerColor="#c0c0c0"
                onPress={() => {
                  setShowAccount(false);
                }}
              />

              <Icon source="account" size={18} />

              <Text
                style={{ fontSize: 18, marginBottom: 2 }}
                variant="bodyLarge"
              >
                {userDoc.name}
              </Text>
              <Appbar.Action
                icon="logout"
                color={cor.signoutbtn}
                mode="contained"
                containerColor="#d5d5d5"
                onPress={() => {
                  auth.signOut();
                  setShowAccount(false);
                }}
              />
            </View>
          ) : (
            <Appbar.Action
              icon="account"
              onPress={() => {
                setShowAccount(true);
              }}
            />
          )
        ) : (
          <Button
            icon="account"
            onPress={() => {
              navigation.navigate("Login");
            }}
            textColor="white"
            style={{ backgroundColor: "blue" }}
          >
            Log-in
          </Button>
        )}
      </Appbar.Header>
      <Tab.Navigator>
        <Tab.Screen
          name="Alugar"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarLabel: "Reservar",
            tabBarIcon: ({ color, size }) => (
              <Icon source="magnify" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerShown: false,
            tabBarLabel: "Minhas reservas",
            tabBarIcon: ({ color, size }) => (
              <Icon source="car" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

function HomeScreen() {
  const { entregaDate, setEntregaDate, retiradaDate, setRetiradaDate } =
    useUser();
  const [showEntregaPicker, setShowEntregaPicker] = useState(false);
  const [showRetiradaPicker, setShowRetiradaPicker] = useState(false);

  const onChangeRetirada = (event, selectedDate) => {
    const currentDate = selectedDate || retiradaDate;
    setShowRetiradaPicker(Platform.OS === "ios");
    setRetiradaDate(currentDate);
  };

  const onChangeEntrega = (event, selectedDate) => {
    const currentDate = selectedDate || entregaDate;
    setShowEntregaPicker(Platform.OS === "ios");
    setEntregaDate(currentDate);
  };

  const { setShowAccount } = useUser();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <TouchableOpacity onPress={() => setShowRetiradaPicker(true)}>
          <Button>Data de Retirada</Button>
          <TextInput
            value={
              retiradaDate.getDate() +
              "/" +
              (retiradaDate.getMonth() + 1) +
              "/" +
              retiradaDate.getFullYear()
            }
            editable={false}
          ></TextInput>
        </TouchableOpacity>

        {showRetiradaPicker && (
          <DateTimePicker
            value={retiradaDate}
            mode="date"
            display="default"
            onChange={onChangeRetirada}
          />
        )}

        <TouchableOpacity onPress={() => setShowEntregaPicker(true)}>
          <Button>Data de Entrega</Button>
          <TextInput
            value={
              entregaDate.getDate() +
              "/" +
              (retiradaDate.getMonth() + 1) +
              "/" +
              entregaDate.getFullYear()
            }
            editable={false}
          ></TextInput>
        </TouchableOpacity>

        {showEntregaPicker && (
          <DateTimePicker
            value={entregaDate}
            mode="date"
            display="default"
            onChange={onChangeEntrega}
          />
        )}

        <Button
          style={{ marginTop: "10%" }}
          icon="car"
          mode="contained"
          onPress={() => {
            navigation.navigate("Home");
            setShowAccount(false);
          }}
        >
          Ver carros disponíveis
        </Button>
      </View>
    </View>
  );
}

function SettingsScreen() {
  const { isLoggedIn } = useUser();
  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <Card
          mode="elevated"
          elevation={5}
          style={{
            borderWidth: 1,
            borderColor: cor.cardsoutline,
            margin: 10,
          }}
        >
          <Card.Content>
            <View style={{ flexDirection: "row" }}>
              <View style={{ marginRight:10 }}>
                <Icon size={24} source={"car"} />
              </View>
              <View
                style={{ flex:1 }}
              >
                <Text variant="titleLarge">Marca e Nome    lembrar de colocar o número da placa nos atributos da tabela carro</Text>
                <Text variant="bodyMedium">03/03/2020 - 10/10/2020</Text>
                <Text variant="bodyMedium">R$20.20</Text>
                <View
                  style={{ flexDirection: "row", justifyContent: "flex-end" }}
                >
                  <Text variant="bodyMedium">ID: #000320030</Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
      ) : (
        <Text variant="headlineMedium">Faça Login para ver suas reservas!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    margin: "3%",
  },

  container: {
    flex: 1,
  },
});
