import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  TextInput,
  ScrollView,
} from "react-native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../redux/AuthSlice";
import * as SecureStore from "expo-secure-store";
import { logOut } from "../api/authApi";

export default function Home({ navigation }) {
  const { userData } = useSelector((state) => state.auth);
  const cards = [
    { name: "Users", icon: "users" },
    { name: "Orders", icon: "box-open" },
    { name: "Stock", icon: "store" },
  ];
  const dispatch = useDispatch();

  const handleLogout = async () => {
    // const token = await SecureStore.getItemAsync("user");
    // const response = await logOut(token);
    await SecureStore.deleteItemAsync("user");
    AsyncStorage.removeItem("app_user");
    dispatch(clearUser());
    navigation.navigate("SignIn");
  };

  const iconComponents = {
    users: <FontAwesome5 name="users" size={24} color="black" />,
    "box-open": <FontAwesome5 name="box-open" size={24} color="black" />,
    store: <FontAwesome5 name="store" size={24} color="black" />,
  };

  const filteredCards =
    userData?.role === "admin"
      ? cards
      : cards.filter((card) => card.name !== "Users");

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome, User!</Text>

      <ScrollView>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
            padding: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {filteredCards.map((tile, index) => (
            <Pressable
              key={index}
              style={{
                width: 250,
                height: 250,
                borderWidth: 1,
                borderColor: "#000",
                borderRadius: 8,
                margin: 15,
                backgroundColor: "#EEEDEB",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                navigation.navigate(tile.name);
              }}
            >
              {iconComponents[tile.icon]}
              <Text style={{ color: "black" }}>{tile.name}</Text>
            </Pressable>
          ))}
          <Pressable
            style={{
              width: 250,
              height: 250,
              borderWidth: 1,
              borderColor: "#000",
              borderRadius: 8,
              margin: 15,
              backgroundColor: "#EEEDEB",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={handleLogout}
          >
            <MaterialCommunityIcons name="logout" size={24} color="black" />
            <Text style={{ color: "black" }}>LogOut</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: "100%",
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    padding: 12,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 45,
    paddingHorizontal: 25,
    width: "100%",
    marginVertical: 10,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
