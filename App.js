import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import SignIn from "./Pages/SignIn";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Pages/Home";
import Users from "./Pages/Users";
import Orders from "./Pages/Orders";
import Stock from "./Pages/Stock";
import { Provider, useSelector } from "react-redux";
import { store } from "./redux/store";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn && user ? "Home" : "SignIn"}
      >
        {isLoggedIn && user ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Users" component={Users} />
            <Stack.Screen name="Orders" component={Orders} />
            <Stack.Screen name="Stock" component={Stock} />
          </>
        ) : (
          <Stack.Screen name="SignIn" component={SignIn} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App() {
  return (
    <View style={styles.container}>
      <AppNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
