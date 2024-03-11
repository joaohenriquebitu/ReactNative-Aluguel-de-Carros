import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { cor } from "../../src/cor";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../src/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useUser } from "../../src/UserContext";
import { Appbar } from "react-native-paper";
import AppbarAction from "react-native-paper/lib/typescript/components/Appbar/AppbarAction";
import AppbarContent from "react-native-paper/lib/typescript/components/Appbar/AppbarContent";

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { updateUserDoc } = useUser();

  function userLogin() {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        updateUserDoc(auth.currentUser.uid);

        console.log("login attempt from user succeeded");

        navigation.goBack();
      })

      .catch((error) => {
        alert("Falha no Login");
        console.log("login attempt from user failed");
      });
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title="Login" />
      </Appbar.Header>

      <View style={styles.container}>
        <View style={styles.center}>
          <View style={{ alignItems: "center" }}></View>
          <TextInput
            placeholder="E-mail"
            style={styles.textInputs}
            onChangeText={setEmail}
            left={<TextInput.Icon icon="at" />}
          />
          <TextInput
            placeholder="Senha"
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={styles.textInputs}
            onChangeText={setPassword}
            left={<TextInput.Icon icon="lock" />}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <Button
              textColor={cor.loginbuttontext}
              style={[styles.buttons, { backgroundColor: cor.button }]}
              icon="login"
              onPress={userLogin}
            >
              Login
            </Button>
          </View>
          <View
            style={{
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center",
              margin: "2%",
              flexShrink: 0,
              backgroundColor: cor.centerbackground,
            }}
          >
            <Text style={{ fontSize: 20 }}>Não tem uma conta? </Text>
            <Button
              textColor={cor.pressableText}
              icon="account-plus"
              labelStyle={{ fontSize: 16 }}
              onPress={() => navigation.navigate("SignUp")}
            >
              Ir para o Cadastro
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    margin: "4%",
    flex: 1,
    borderWidth: 3,
    borderColor: cor.button,
  },
  textInputs: {
    margin: "3%",
  },

  center: {
    paddingTop: 40,
    borderRadius: 20,
    margin: "2%",
    flexGrow: 0,
    backgroundColor: cor.centerbackground,
  },
  container: {
    flex: 1,
    backgroundColor: cor.background,
    justifyContent: "center",
  },
});
