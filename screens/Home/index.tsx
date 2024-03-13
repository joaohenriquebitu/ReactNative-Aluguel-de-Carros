import {
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
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
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../src/UserContext";

import { cor } from "../../src/cor";
import { StyleSheet } from "react-native";
import { Image } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { db } from "../../src/firebaseConfig";
import { auth } from "../../src/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

async function verificarDisponibilidade(carId, novaInicio, novaFim) {
  const reservasRef = query(
    collection(db, "reservas"),
    where("carId", "==", carId)
  );

  const reservasSnapshot = await getDocs(reservasRef);
  console.log("carro: " + carId);
  console.log("qtd de reservas: " + reservasSnapshot.size);
  for (const reservaDoc of reservasSnapshot.docs) {
    const reserva = reservaDoc.data();
    const inicioReserva = reserva.inicio.toDate();
    const fimReserva = reserva.fim.toDate();

    console.log(
      "reserva do " +
        carId +
        " encontrada de " +
        inicioReserva +
        " à " +
        fimReserva
    );
    console.log("testando se " + novaInicio + " à " + novaFim + " colidem ");

    if (
      (novaInicio >= inicioReserva && novaInicio <= fimReserva) ||
      (novaFim >= inicioReserva && novaFim <= fimReserva) ||
      (inicioReserva >= novaInicio && inicioReserva <= novaFim) ||
      (fimReserva >= novaInicio && fimReserva <= novaFim)
    ) {
      console.log("aparentemente colidem!");
      return false;
    }
  }
  console.log("aparentemente não colidem!");
  return true;
}

export default function Home() {
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const onRefresh = useCallback(() => {
    loadAvailableCars();
  }, []);

  const [showAccount, setShowAccount] = useState(false);
  const { isLoggedIn, userDoc, retiradaDate, entregaDate } = useUser();
  const [modalOn, setModalOn] = useState(false);
  const [loadingCars, setLoadingCars] = useState(true);
  const [carDetailed, setCarDetailed] = useState(0);
  const [cars, setCars] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState("Carregando...");

  const loadAvailableCars = async () => {
    setLoadingStatus("Carregando Carros...");
    setLoadingCars(true);
    setCars([]);
    console.log("loading cars data");

    try {
      const querySnapshot = await getDocs(collection(db, "carsData"));
      const availableCars = [];
      setLoadingStatus("Verificando Disponibilidade...");
      console.log(querySnapshot.size);
      querySnapshot.size === 0
        ? setError(
            "Falha no acesso ao servidor, verifique sua conexão à internet."
          )
        : setError("Nenhum veículo disponível");
      for (const doc of querySnapshot.docs) {
        const car = doc.data();
        if (
          await verificarDisponibilidade(+doc.id, retiradaDate, entregaDate)
        ) {
          car.id = +doc.id;
          availableCars.push(car);
        }
      }
      setCars(availableCars);
      console.log("cars data loaded");
    } catch (error) {
      setError("Ocorreu um erro ao carregar: \n" + error.message);
    }

    setLoadingCars(false);
  };

  useEffect(() => {
    loadAvailableCars();
  }, []);

  return (
    <PaperProvider>
      <Portal>
        <Modal
          visible={modalOn}
          onDismiss={() => setModalOn(false)}
          style={{ justifyContent: "flex-end", flex: 1 }}
        >
          {cars[carDetailed] ? (
            <View
              style={{
                flexGrow: 0,
                backgroundColor: cor.modalviewbackground,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
              }}
            >
              <Image
                source={{ uri: cars[carDetailed].image }}
                resizeMode="cover"
                style={{ height: 240, marginTop: -130 }}
              />

              <Text
                variant="displaySmall"
                style={{
                  marginTop: -20,
                  textAlign: "center",
                }}
              >
                {cars[carDetailed].name}
              </Text>
              <View
                style={{
                  flexWrap: "wrap",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  borderRadius: 15,
                  backgroundColor: "rgba(0,0,0,0.1)",
                }}
              >
                <List.Item
                  title={cars[carDetailed].maxPassengers + " Pessoas"}
                  left={() => <List.Icon icon="account" />}
                />

                <List.Item
                  title={cars[carDetailed].steering}
                  left={() => <List.Icon icon="steering" />}
                />
                {cars[carDetailed].airbagCount !== 0 ? (
                  <List.Item
                    title={cars[carDetailed].airbagCount + " Airbags"}
                    left={() => <List.Icon icon="airbag" />}
                  />
                ) : null}
                <List.Item
                  title={cars[carDetailed].trunkLiters + " Litros"}
                  left={() => <List.Icon icon="bag-suitcase" />}
                />

                {cars[carDetailed].transmission == "Elétrico" ? (
                  <>
                    <List.Item
                      title={"Elétrico"}
                      left={() => <List.Icon icon="flash" />}
                    />

                    <List.Item
                      title={cars[carDetailed].numShifts + " Km Autonomia"}
                      left={() => <List.Icon icon="battery-70" />}
                    />
                  </>
                ) : (
                  <>
                    <List.Item
                      title={cars[carDetailed].transmission}
                      left={() => <List.Icon icon="cog" />}
                    />

                    <List.Item
                      title={cars[carDetailed].numShifts + " Marchas"}
                      left={() => <List.Icon icon="car-shift-pattern" />}
                    />
                  </>
                )}

                {cars[carDetailed].hasAC ? (
                  <List.Item
                    title={"Ar-Condicionado"}
                    left={() => <List.Icon icon="snowflake" />}
                  />
                ) : null}
                {cars[carDetailed].hasABS ? (
                  <List.Item
                    title={"Tem ABS"}
                    left={() => <List.Icon icon="car-brake-abs" />}
                  />
                ) : null}
                {cars[carDetailed].hasTCS ? (
                  <List.Item
                    title={"Controle de Tração"}
                    left={() => <List.Icon icon="car-traction-control" />}
                  />
                ) : null}
              </View>
            </View>
          ) : null}
        </Modal>
      </Portal>
      <View style={{ flex: 1 }}>
        <Appbar.Header style={{ backgroundColor: "white" }}>
          <Appbar.BackAction onPress={navigation.goBack}></Appbar.BackAction>
          <Appbar.Action
            icon="reload"
            onPress={() => {
              loadAvailableCars();
            }}
          />
          <Appbar.Content title="Carros" />

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

        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {cars && cars.length > 0 && !loadingCars ? (
            cars.map((car) => (
              <Card
                key={car.id}
                mode="elevated"
                elevation={5}
                style={{
                  borderWidth: 1,
                  borderColor: cor.cardsoutline,
                  margin: 10,
                }}
              >
                <Card.Cover
                  source={{ uri: car.image }}
                  resizeMode={"center"}
                  style={{ height: 140 }}
                />
                <Card.Content>
                  <Text variant="titleLarge">
                    {car.brand} {car.name}
                  </Text>
                  <Text variant="bodyMedium">R${car.cost}/dia</Text>
                </Card.Content>
                <View style={{ flexDirection: "row" }}>
                  <Button
                    mode="outlined"
                    textColor={cor.button}
                    style={styles.buttons}
                    icon="plus"
                    onPress={() => {
                      console.log(
                        "car: " +
                          car.id +
                          " index: " +
                          cars.indexOf(car) +
                          " details button pressed"
                      );
                      setCarDetailed(cars.indexOf(car));
                      setModalOn(true);
                    }}
                  >
                    Ver Detalhes
                  </Button>
                  <Button
                    disabled={!car.available}
                    textColor={cor.loginbuttontext}
                    style={[styles.buttons, { backgroundColor: cor.button }]}
                    icon={car.available ? "car" : "emoticon-sad"}
                    onPress={() => {
                      console.log(car.id + " alugar pressed");
                      if (!isLoggedIn) {
                        navigation.navigate("Login");
                      } else {
                        null
                        // navigation.navigate("Rental");
                      }
                    }}
                  >
                    {car.available ? "Reservar" : "Indisponível"}
                  </Button>
                </View>
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
              {loadingCars ? (
                <>
                  <ActivityIndicator
                    animating={true}
                    color={"blue"}
                    size={"large"}
                  />
                  <Text>{loadingStatus}</Text>
                </>
              ) : error === "No cars available" ? (
                <>
                  <IconButton
                    icon="emoticon-sad-outline"
                    color="red"
                    size={40}
                  />
                  <Text style={{ textAlign: "center" }}>
                    {"Não há veículos disponíveis para estas datas."}
                  </Text>
                </>
              ) : (
                <>
                  <IconButton icon="alert-circle" color="red" size={40} />
                  <Text style={{ color: "red", textAlign: "center" }}>
                    {error}
                  </Text>
                </>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
  buttons: {
    margin: "2%",
    flex: 1,
    borderWidth: 3,
    borderColor: cor.button,
  },
});
