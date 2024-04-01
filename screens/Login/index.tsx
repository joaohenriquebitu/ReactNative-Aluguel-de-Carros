import { StatusBar } from "expo-status-bar";
import { Alert, StyleSheet, View } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import { cor } from "../../src/cor";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../src/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useUser } from "../../src/UserContext";
import { Appbar } from "react-native-paper";
import AppbarAction from "react-native-paper/lib/typescript/components/Appbar/AppbarAction";
import AppbarContent from "react-native-paper/lib/typescript/components/Appbar/AppbarContent";
import { StackNavigation, StackTypes } from "../../routes/stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
type propsType = NativeStackScreenProps<StackNavigation, "Login">;
export default function Login(props: propsType) {
  const { navigation } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { updateUserDoc } = useUser();

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: cor.appbarbackground }}>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title="Login" />
      </Appbar.Header>

      <View style={styles.container}>
        <View style={styles.center}>
          <View style={{ alignItems: "center" }}></View>
          <TextInput placeholder="E-mail" style={styles.textInputs} onChangeText={setEmail} left={<TextInput.Icon icon="at" />} />
          <TextInput
            placeholder="Senha"
            secureTextEntry={!showPassword}
            right={<TextInput.Icon icon={showPassword ? "eye" : "eye-off"} onPress={() => setShowPassword(!showPassword)} />}
            style={styles.textInputs}
            onChangeText={setPassword}
            left={<TextInput.Icon icon="lock" />}
          />
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <Button
              textColor={cor.loginbuttontext}
              style={[styles.buttons, { backgroundColor: cor.button }]}
              icon="login"
              onPress={async () => {
                try {
                  await signInWithEmailAndPassword(auth, email, password);

                  await updateUserDoc(auth.currentUser.uid);

                  console.log("login attempt from user succeeded");

                  navigation.goBack();
                } catch (error) {
                  Alert.alert("Falha no Login", "Ocorreu um erro ao fazer o login. Verifique seu email e sua senha e tente novamente.");
                  console.log("login attempt from user failed");
                }
              }}
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
              backgroundColor: cor.centerbackground,
            }}
          >
            <Text variant="titleMedium">Não tem uma conta? </Text>
            <Button textColor={cor.pressableText} icon="account-plus" labelStyle={{ fontSize: 15 }} onPress={() => navigation.navigate("SignUp")}>
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
