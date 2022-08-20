import { NavigationContainer } from "@react-navigation/native";
import { AppRoutes } from "./app.routes";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { SignIn } from "../screens/SignIn";

export function Routes() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((r) => {
      setUser(r);
      setLoading(false);
    });

    return subscriber;
  }, []);

  if (loading) return <Loading />;
  else
    return (
      <NavigationContainer>
        {user ? <AppRoutes /> : <SignIn />}
      </NavigationContainer>
    );
}
