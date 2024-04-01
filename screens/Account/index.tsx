import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useUser } from "../../src/UserContext";
import { auth } from "../../src/firebaseConfig";
import { Icon, TextInput, Appbar, Button, Modal, Portal, PaperProvider, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { cor } from "../../src/cor";
import { StackNavigation, StackTypes } from "../../routes/stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
type propsType = NativeStackScreenProps<StackNavigation, "Account">;

export default function Account(props: propsType) {
  const { userDoc } = useUser();
  const {navigation} = props;
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
            <View style={{ backgroundColor: "white", margin: "10%", padding: "5%", borderRadius: 10 }}>
              <View style={{ flexDirection: "row"}}>
                <View style={{flex:1}}>
                <Icon size={40} source="alert" />
                </View>
                <View style={{flex:4}}>
                  <Text variant="bodyMedium" style={{ color: "red" }}>
                    Atenção: a exclusão da conta não pode ser desfeita!{"\n"}
                  </Text>
                </View>
              </View>
              <Text variant="bodyMedium">Digite sua senha para confirmar a exclusão:{"\n"}</Text>
              <TextInput secureTextEntry value={password} onChangeText={setPassword} placeholder="Senha" />
              <View style={{ flexDirection: "row-reverse", margin: "5%" }}>
                <Button
                  buttonColor="red"
                  textColor="blue"
                  onPress={async () => {
                    setModalVisible(false);
                    try {
                      await signInWithEmailAndPassword(auth, auth.currentUser.email, password);
                      setPassword("");
                      await auth.currentUser.delete();
                      navigation.navigate("Landing");
                      
                    } catch (error) {
                      Alert.alert("Erro na exclusão da conta", "Erro na exclusão da conta, verifique se sua senha está correta.\n" + error.message);
                    }
                    
                  }}
                >
                  Excluir
                </Button>
                <Button
                  textColor="blue"
                  onPress={() => {
                    setModalVisible(false);
                    setPassword("");
                  }}
                >
                  Cancelar
                </Button>
              </View>
            </View>
          </Modal>
        </Portal>
        <Appbar.Header style={{backgroundColor:cor.appbarbackground}}>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title="Informações da conta" />
        </Appbar.Header>
        <View style={{ flex: 1, justifyContent: "center", margin: 10 }}>
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
          <View style={{ flex: 0, flexDirection: "row", marginVertical: "5%" }}>
            <Button icon="delete" mode="contained" onPress={() => setModalVisible(true)}>
              Excluir conta
            </Button>
          </View>
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  editProfile: {
    color: "blue",
    marginTop: 10,
  },
});
