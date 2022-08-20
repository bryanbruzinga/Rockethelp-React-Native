import { useNavigation, useRoute } from "@react-navigation/native";
import { Box, HStack, ScrollView, Text, useTheme, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { OrderProps } from "../components/Order";
import firestore from "@react-native-firebase/firestore";
import { OrderFirestoreDTO } from "../DTOs/OrderDTO";
import { dateFormat } from "../utils/firestoreDateFormat";
import { Loading } from "../components/Loading";
import {
  CircleWavyCheck,
  Clipboard,
  DesktopTower,
  Hourglass,
} from "phosphor-react-native";
import { CardDetails } from "../components/CardDetails";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Alert } from "react-native";

type RouteParams = {
  orderId: string;
};

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
};

export function Details() {
  const [solution, setSolution] = useState("");
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
  const route = useRoute();
  const { orderId } = route.params as RouteParams;
  const { colors } = useTheme();
  const navigation = useNavigation();

  function handleOrderClose() {
    if (!solution)
      return Alert.alert(
        "Solicitação",
        "Informe a solução para encerrar a solicitação"
      );

    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .update({
        status: "closed",
        solution,
        closed_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        navigation.goBack();
        Alert.alert("Solicitação", "Solicitação encerrada.");
      })
      .catch((e) =>
        Alert.alert("Solicitação", "Não fio possível encerrar a solicitação")
      );
  }

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .get()
      .then((r) => {
        const {
          patrimony,
          description,
          status,
          created_at,
          closed_at,
          solution,
        } = r.data();
        const closed = closed_at ? dateFormat(closed_at) : null;
        setOrder({
          id: r.id,
          patrimony,
          description,
          status,
          solution,
          when: dateFormat(created_at),
          closed,
        });
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;
  else
    return (
      <VStack flex={1} bg="gray.700">
        <Box px={6} bg="gray.600">
          <Header title="Solicitação" />
        </Box>
        <HStack bg="gray.500" justifyContent="center" p={4}>
          {order.status === "closed" ? (
            <CircleWavyCheck size={22} color={colors.green[300]} />
          ) : (
            <Hourglass size={22} color={colors.secondary[300]} />
          )}
          <Text
            fontSize="sm"
            color={
              order.status === "closed"
                ? colors.green[300]
                : colors.secondary[700]
            }
            ml={2}
            textTransform="uppercase"
          >
            {order.status === "closed" ? "Finalizado" : "em andamento"}
          </Text>
        </HStack>
        <ScrollView mx={5} showsVerticalScrollIndicator={false}>
          <CardDetails
            title="equipamento"
            description={`Patrimônio ${order.patrimony}`}
            icon={DesktopTower}
          />

          <CardDetails
            title="descrição do problema"
            description={order.description}
            icon={Clipboard}
            footer={`Registrado em ${order.when}`}
          />

          <CardDetails
            title="solução"
            icon={CircleWavyCheck}
            description={order.solution}
            footer={order.closed && `Encerrado em ${order.closed}`}
          >
            {order.status === "open" && (
              <Input
                placeholder="Descrição da solução"
                onChangeText={setSolution}
                h={24}
                textAlignVertical="top"
                multiline
              />
            )}
          </CardDetails>
        </ScrollView>

        {order.status === "open" && (
          <Button
            title="Encerrar solicitação"
            m={5}
            onPress={handleOrderClose}
          />
        )}
      </VStack>
    );
}
