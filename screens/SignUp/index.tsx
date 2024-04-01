import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, TextInput, Appbar, Text } from "react-native-paper";
import { cor } from "../../src/cor";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth, firebaseApp } from "../../src/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  collection,
  addDoc,
  Firestore,
  getFirestore,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../src/firebaseConfig";
import { Alert } from "react-native";
import { useUser } from "../../src/UserContext";
import { StackNavigation, StackTypes } from "../../routes/stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
type propsType = NativeStackScreenProps<StackNavigation, "Rental">;
export default function SignUp(props: propsType) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cpf, setCpf] = useState("");
  const { updateUserDoc } = useUser();

  const {navigation} = props;
  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor:cor.appbarbackground}}>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title="Cadastro" />
      </Appbar.Header>

      <ScrollView style={styles.centerScroll}>
        <TextInput
          placeholder="E-mail"
          style={styles.textInputs}
          onChangeText={setUser}
          left={<TextInput.Icon icon="at" />}
        />
        <TextInput
          placeholder="Senha"
          style={styles.textInputs}
          secureTextEntry
          onChangeText={setPassword}
          left={<TextInput.Icon icon="lock" />}
        />
        <View style={{ flexDirection: "row" }}>
          <TextInput
            placeholder="Nome"
            style={[styles.textInputs, { marginRight: 3 }]}
            onChangeText={setName}
            left={<TextInput.Icon icon="account-details" />}
          />
          <TextInput
            placeholder="Sobrenome"
            style={[styles.textInputs, { marginLeft: 3 }]}
            onChangeText={setSurname}
          />
        </View>
        <TextInput
          placeholder="Endereço"
          style={styles.textInputs}
          onChangeText={setAddress}
          left={<TextInput.Icon icon="home" />}
        />
        <TextInput
          placeholder="Celular"
          style={styles.textInputs}
          onChangeText={setPhone}
          left={<TextInput.Icon icon="cellphone" />}
        />
        <TextInput
          placeholder="CPF"
          style={styles.textInputs}
          onChangeText={setCpf}
          left={<TextInput.Icon icon="card-account-details" />}
        />
        <View
          style={{ flexDirection: "row", justifyContent: "space-around" }}
        ></View>
        <View
          style={{
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",

            margin: "3%",
            backgroundColor:cor.centerbackground,
            borderRadius:10,
            
            flexShrink: 0,
          }}
        >
          <Text variant="titleMedium">Já tem uma conta? </Text>
          <Button
            textColor={cor.pressableText}
            labelStyle={{ fontSize: 15 }}
            icon="login"
            onPress={() => navigation.navigate("Login")}
          >
            Ir para o Login
          </Button>
        </View>
      </ScrollView>

      <View style={styles.signupbtn}>
        <Button
          textColor={cor.loginbuttontext}
          style={[styles.buttons, { backgroundColor: cor.button }]}
          icon="account-plus"
          onPress={async () => {
            console.log("Sign-in button pressed");
            try {
              const userCredential = await createUserWithEmailAndPassword(
                auth,
                user,
                password
              );
              const userDoc = doc(
                collection(db, "users"),
                userCredential.user.uid
              );
              setDoc(userDoc, {
                name: name,
                surname: surname,
                email: user,
                phone: phone,
                address: address,
                cpf: cpf,
              });

              updateUserDoc();

              console.log(
                "SignUp sucessful doc written with ID: ",
                userDoc.id
              );

              navigation.navigate("Landing");
            } catch (error) {
              console.error("Error adding doc: ", error);
              console.log(error);
              console.log(error.code);
              if (error.code == "auth/email-already-in-use") {
                Alert.alert("Erro", "Uma conta com esse email já existe");
              }
            }
          }}
        >
          Cadastre-se
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  signupbtn: {
    flexGrow: 0,
    flexShrink: 0,
  },
  buttons: {
    margin: "3%",
    borderWidth: 3,
    borderColor: cor.button,
  },
  textInputs: {
    flex: 1,
    marginHorizontal: "3.2%",
    margin: "2%",
  },
  centerScroll: {
    flexShrink: 1,
    flexGrow: 0,
    backgroundColor: cor.background,
  },
  container: {
    flex: 1,
    backgroundColor: cor.background,
    justifyContent: "space-between",
  },
});
