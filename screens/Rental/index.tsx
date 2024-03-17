import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useUser } from "../../src/UserContext";
import { Image } from "react-native";
import { Appbar, Button, Checkbox, Divider, Icon, Menu, PaperProvider, RadioButton, Switch, Text } from "react-native-paper";
import { db } from "../../src/firebaseConfig";
import { auth } from "../../src/firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";

export default function Rental() {
  const { userDoc, retiradaDate, entregaDate, cars, isLoggedIn } = useUser();
  const route = useRoute();
  const [menuOn, setMenuOn] = useState(false);
  const [seguro, setSeguro] = useState(false);
  const [seguroCost, setSeguroCost] = useState(0);
  const [checkbox, setCheckbox] = useState<"checked" | "unchecked" | "indeterminate">("unchecked");
  const { carSelected } = route.params;
  const navigation = useNavigation();
  const dateDifference = () => {
    const differenceMs = entregaDate - retiradaDate;
    return Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
  };
  return (
    <PaperProvider>
      <View style={{ flex: 1 }}>
        <Appbar.Header style={{ backgroundColor: "white" }}>
          <Appbar.BackAction onPress={navigation.goBack}></Appbar.BackAction>
          <Appbar.Content title="Confirme sua reserva" />

          {isLoggedIn ? (
            <Menu
              visible={menuOn}
              onDismiss={() => setMenuOn(false)}
              anchor={
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{ flexDirection: "row", backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 10, flex: 0.8, alignItems: "center", paddingHorizontal: 8, marginVertical: 5 }}
                  onPress={() => {
                    setMenuOn(true);
                  }}
                >
                  <Icon size={25} source="account-circle-outline" />
                  <Icon size={25} source="menu-down" />
                </TouchableOpacity>
              }
            >
              <Menu.Item
                leadingIcon="account"
                onPress={() => {
                  navigation.navigate("Account");
                  setMenuOn(false);
                }}
                title="Ver informações da conta"
              />
              <Divider />
              <Menu.Item leadingIcon="logout" onPress={() => auth.signOut()} title="Sair" />
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

        <ScrollView style={{ flex: 1 }}>
          <View style={{ flex: 1, margin: 10, backgroundColor: "rgba(0,0,0,.2)", borderRadius: 30, padding: 9 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", borderRadius: 20,  }}>
              <Image source={{ uri: cars[carSelected].image }} resizeMode="contain" style={{ height: 100, width: 200 }} />

              <Text variant="titleLarge">{cars[carSelected].name + "\n" + cars[carSelected].year}</Text>
            </View>

            <View style={{ flex: 1, justifyContent: "center" }}>
              <View style={styles.rows}>
                <Text variant="bodyLarge">Preço diário:</Text>
                <Text variant="bodyLarge">{cars[carSelected].cost} R$</Text>
              </View>
              <View style={styles.rows}>
                <Text variant="bodyLarge">Dias selecionados:</Text>
                <Text variant="bodyLarge">{dateDifference()}</Text>
              </View>
              <View style={[styles.rows, { flexDirection: "column" }]}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text variant="bodyLarge">Seguro:</Text>
                  <Text variant="bodyLarge">{seguroCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })} (10%)</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                  <RadioButton.Item
                    value=""
                    label="Sem seguro"
                    onPress={() => {
                      setSeguroCost(0);
                      setSeguro(false);
                    }}
                    style={{ flexDirection: "row" }}
                    status={!seguro ? "checked" : "unchecked"}
                  />

                  <RadioButton.Item
                    value=""
                    label="Com seguro"
                    onPress={() => {
                      setSeguro(true);
                      setSeguroCost(Math.floor((0.1 * cars[carSelected].cost)* 100) / 100);
                    }}
                    status={seguro ? "checked" : "unchecked"}
                  />
                </View>
              </View>

              <View style={styles.mainRows}>
                <Text variant="bodyLarge">Preço Total:</Text>
                <Text variant="bodyLarge">{(cars[carSelected].cost * dateDifference() + seguroCost).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })}</Text>
              </View>
            </View>
            <View style={{ backgroundColor: "rgba(0,0,0,.1)", padding: 10, borderRadius: 20, marginTop: 30 }}>
              <Text variant="titleLarge" style={{ textAlign: "center" }}>
                Verifique suas informações:
              </Text>
              <Text style={styles.text}>Nome:</Text>
              <View style={styles.infos}>
                <Icon source="account" size={20}></Icon>
                <Text style={{ marginHorizontal: 10 }}>{userDoc.name + " " + userDoc.surname}</Text>
              </View>
              <Text style={styles.text}>E-mail:</Text>
              <View style={styles.infos}>
                <Icon source="at" size={20}></Icon>
                <Text style={styles.text}>{userDoc.email}</Text>
              </View>
              <Text style={styles.text}>Endereço:</Text>
              <View style={styles.infos}>
                <Icon source="home" size={20}></Icon>
                <Text style={styles.text}>{userDoc.address}</Text>
              </View>
              <Text style={styles.text}>CPF:</Text>
              <View style={styles.infos}>
                <Icon source="card-account-details" size={20}></Icon>
                <Text style={styles.text}>{userDoc.cpf}</Text>
              </View>
              <Text style={styles.text}>Telefone:</Text>
              <View style={styles.infos}>
                <Icon source="cellphone" size={20}></Icon>
                <Text style={styles.text}>{userDoc.phone}</Text>
              </View>
            </View>
            <View style={{ marginTop: 30, backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 20, padding: 10 }}>
              <Checkbox.Item
                label="Sou habilitado e possuo CNH com data de validade vigente"
                status={checkbox}
                onPress={() => setCheckbox(checkbox === "checked" ? "unchecked" : checkbox === "unchecked" ? "checked" : "unchecked")}
              />

              <Button style={{ marginTop: 10 }} mode="contained" disabled={checkbox != "checked"}
              
              onPress={async()=>{

                const numReserva = (cars[carSelected].id+retiradaDate.toISOString().split('T')[0].replace(/-/g, ''))



                try {
                  await setDoc(doc(db, "reservas", numReserva), {
                    carBrand: cars[carSelected].brand,
                    carId: cars[carSelected].id,
                    carName: cars[carSelected].name,
                    carPlate: cars[carSelected].plate,
                    fim: entregaDate,
                    inicio: retiradaDate,
                    price: cars[carSelected].cost * dateDifference() + seguroCost,
                    status: 'OK',
                    userId: auth.currentUser.uid,
                    hasInsurance: seguro
                  });
                  console.log('Reserva adicionada com sucesso!');
                } catch (error) {
                  console.error('Erro ao adicionar reserva:', error);
                }
                navigation.navigate("Landing");
                console.log("reserva criada com id:" + numReserva);
              }

                
              }
              
              
              >
                Reservar
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  rows: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,.1)",
    padding: 10,
    marginVertical: 4,
    borderRadius: 20,
  },
  mainRows: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,255,0,.3)",
    padding: 10,
    marginVertical: 4,
    borderRadius: 20,
  },
  text: {
    marginHorizontal: 10,
  },
  infos: {
    flexDirection: "row",
    padding: "3%",
    marginVertical: "1%",
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 10,
  },
});
