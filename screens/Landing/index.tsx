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
  Checkbox,
} from "react-native-paper";
import { CommonActions, useFocusEffect, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState, useEffect, useCallback } from "react";
import { auth, db } from "../../src/firebaseConfig";
import { useUser } from "../../src/UserContext";
import { StyleSheet } from "react-native";
import { cor } from "../../src/cor";
import { collection, getDocs, query, where } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import CardContent from "react-native-paper/lib/typescript/components/Card/CardContent";

const Tab = createBottomTabNavigator();

async function LoadUserReservations(userId, setReservations, setLoadingTimeout) {
  setLoadingTimeout(false);
  const userReservations = [];
  const reservasRef = query(collection(db, "reservas"), where("userId", "==", userId));
  const timeout = setTimeout(() => {
    setLoadingTimeout(true);
  }, 10000);
  const reservasSnapshot = await getDocs(reservasRef);

  for (const doc of reservasSnapshot.docs) {
    const currentReservation = doc.data();
    currentReservation.id = doc.id;
    userReservations.push(currentReservation);
  }
  console.log(userReservations.length);
  setReservations(userReservations);
  clearTimeout(timeout);
}

export default function Landing() {
  const navigation = useNavigation();
  const { isLoggedIn, userDoc, showAccount, setShowAccount } = useUser();
  const [menuOn, setMenuOn] = useState(false);

  useEffect(() => {}, []);

  return (
    <PaperProvider>
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: "white" }}>
        <Appbar.Content title="Aluga" />

        {isLoggedIn ? (
            <Menu
              visible={menuOn}
              onDismiss={() => setMenuOn(false)}
              anchor={<TouchableOpacity
                activeOpacity={0.8}
                style={{flexDirection:"row", backgroundColor:"rgba(0,0,0,0.2)", borderRadius:10, flex:0.8, alignItems:"center", paddingHorizontal:8, marginVertical:5}}
                onPress={() => {
                  setMenuOn(true);
                }}
                >
                <Icon
                  size={25}
                  source="account-circle-outline"
                  
                />
                <Icon
                  size={25}
                  source="menu-down"
                  
                />
                </TouchableOpacity>
              }
            >
              <Menu.Item leadingIcon="account" onPress={() => {navigation.navigate("Account"); setMenuOn(false)}} title="Ver informações da conta" />
              <Divider />
              <Menu.Item leadingIcon="logout" onPress={()=>auth.signOut()} title="Sair" />
            </Menu>
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
            tabBarIcon: ({ color, size }) => <Icon source="magnify" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={ReservationsScreen}
          options={{
            headerShown: false,
            tabBarLabel: "Minhas reservas",
            tabBarIcon: ({ color, size }) => <Icon source="car" size={size} color={color} />,
          }}
        />
      </Tab.Navigator>
    </View>
  </PaperProvider>
  );
}

function HomeScreen() {
  const { entregaDate, setEntregaDate, retiradaDate, setRetiradaDate } = useUser();
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

  const { setShowAccount, filterAvailables, setFilterAvailables } = useUser();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <TouchableOpacity onPress={() => setShowRetiradaPicker(true)}>
          <Button>Data de Retirada</Button>
          <TextInput value={retiradaDate.getDate() + "/" + (retiradaDate.getMonth() + 1) + "/" + retiradaDate.getFullYear()} editable={false}></TextInput>
        </TouchableOpacity>

        {showRetiradaPicker && <DateTimePicker value={retiradaDate} mode="date" display="default" onChange={onChangeRetirada} />}

        <TouchableOpacity onPress={() => setShowEntregaPicker(true)}>
          <Button>Data de Entrega</Button>
          <TextInput value={entregaDate.getDate() + "/" + (entregaDate.getMonth() + 1) + "/" + entregaDate.getFullYear()} editable={false}></TextInput>
        </TouchableOpacity>

        {showEntregaPicker && <DateTimePicker value={entregaDate} mode="date" display="default" onChange={onChangeEntrega} />}

        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: "5%",
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: 10,
          }}
          onPress={() => {
            setFilterAvailables(!filterAvailables);
          }}
        >
          <Checkbox status={filterAvailables ? "checked" : "unchecked"} />
          <Text variant="bodyMedium">Mostrar apenas veículos disponíveis</Text>
        </TouchableOpacity>
        <Button
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

function ReservationsScreen() {
  const { isLoggedIn } = useUser();
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadReservations = async () => {
        setLoadingReservations(true);
        console.log("loading reservations");
        if (isLoggedIn) {
          await LoadUserReservations(auth.currentUser.uid, setReservations, setLoadingTimeout);
          console.log("Reservas loaded");
        }
        setLoadingReservations(false);
      };
      loadReservations();
    }, [isLoggedIn])
  );

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        !loadingReservations && reservations.length > 0 ? (
          
            reservations.map((reservation) => (
              <Card
              key={reservation.id}
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
                  <View style={{ marginRight: 10 }}>
                    <Icon size={24} source={"car"} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text variant="titleLarge">{reservation.carBrand + " " + reservation.carName}</Text>
                      <View style={{ backgroundColor: "#c9c9c9", borderRadius: 5, borderColor: "#FF2020", borderWidth: 2 }}>
                        <View style={{ backgroundColor: "blue", flexBasis: 8, borderTopLeftRadius: 2, borderTopRightRadius: 2, alignItems: "center" }}>
                          <Text style={{ fontSize: 6, color: "white" }}>BRASIL</Text>
                        </View>
                        <Text style={{ fontWeight: "900", textAlignVertical: "bottom", paddingHorizontal: 6, color: "#FF2020" }}>{reservation.carPlate}</Text>
                      </View>
                    </View>
                    <Text variant="bodyMedium">
                      {reservation.inicio.toDate().toLocaleDateString()} - {reservation.fim.toDate().toLocaleDateString()}
                    </Text>
                    <Text variant="bodyMedium">{reservation.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })}</Text>
                    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                      <Text variant="bodyMedium">ID: #{reservation.id}</Text>
                    </View>
                  </View>
                </View>
              </Card.Content>
              </Card>
            ))
          
        ) : (
          <View
            style={{
              alignItems: "center",
              justifyContent: "space-evenly",
              backgroundColor: "rgba(0,0,0,0.1)",
              flexGrow: 0.15,
              borderRadius: 50,
              margin: "15%",
            }}
          >
            {loadingReservations ? (
              <>
                <ActivityIndicator animating={true} color={"blue"} size={"large"} />
                <Text>Carregando suas reservas...</Text>
              </>
            ) : loadingTimeout ? (
              <>
                <IconButton icon="alert-circle" iconColor="red" size={40} />
                <Text style={{ color: "red", textAlign: "center" }}>Você está sem conexão à internet</Text>
              </>
            ) : (
              <>
                <IconButton icon="calendar-question" size={40} />
                <Text style={{ textAlign: "center" }}>Você não fez nenhuma reserva</Text>
              </>
            )}
          </View>
        )
      ) : (
        <Text variant="headlineMedium">Faça Login para ver suas reservas!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignContent: "center",
    justifyContent: "center",
    margin: "3%",
  },

  container: {
    flex: 1,
    justifyContent: "center",
  },
});
