import React, { useState } from "react";
import { Heading, Icon, useTheme, VStack } from "native-base";
import Logo from "../assets/logo_primary.svg";
import { Input } from "../components/Input";
import { Envelope, Key } from "phosphor-react-native";
import { Button } from "../components/Button";
import { Alert } from "react-native";
import auth from "@react-native-firebase/auth";

export function SignIn() {
  const [isLoading, setIsloading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { colors } = useTheme();

  function handleSignIn() {
    if (!email || !password) {
      return Alert.alert("Entrar", "Informe e-mail e senha");
    }
    setIsloading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((e) => Alert.alert("Entrar", "E-mail ou senha inválido"))
      .finally(() => setIsloading(false));
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />
      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta
      </Heading>
      <Input
        placeholder="E-mail"
        mb={4}
        InputLeftElement={
          <Icon as={Envelope} color={colors.gray[300]} ml={4} />
        }
        onChangeText={(value) => setEmail(value)}
      />
      <Input
        placeholder="Senha"
        InputLeftElement={<Icon as={Key} color={colors.gray[300]} ml={4} />}
        secureTextEntry
        mb={8}
        onChangeText={(value) => setPassword(value)}
      />
      <Button
        title="Entrar"
        w="full"
        onPress={handleSignIn}
        isLoading={isLoading}
      />
    </VStack>
  );
}
