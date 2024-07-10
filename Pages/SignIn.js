import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Ionicons } from "@expo/vector-icons";
import { signIn } from "../api/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setSuccessfulSignIn } from "../redux/AuthSlice";
import * as SecureStore from "expo-secure-store";

const SignIn = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const signInSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={signInSchema}
        onSubmit={async (values, { resetForm }) => {
          setIsLoading(true);
          try {
            const response = await signIn(values.email, values.password);
            if (response?.token) {
              dispatch(setSuccessfulSignIn(response));
              await SecureStore.setItemAsync("user", response?.token);
              await AsyncStorage.setItem("app_user", response?.token);
              Alert.alert(
                "Sign In Successful",
                "You have successfully signed in!",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      resetForm();
                      navigation.navigate("Home");
                    },
                  },
                ],
                { cancelable: false }
              );
            } else {
              Alert.alert(
                "Sign In Failed",
                response?.error || "An error occurred. Please try again.",
                [{ text: "OK" }],
                { cancelable: false }
              );
            }
            setIsLoading(false);
          } catch (err) {
            console.log(err);
            setIsLoading(false);
          }
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            {isLoading ? (
              <ActivityIndicator size="large" color="black" />
            ) : (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  keyboardType="email-address"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                />
                {touched.email && errors.email && (
                  <Text style={styles.error}>{errors.email}</Text>
                )}

                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={!passwordVisible}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                  />
                  <TouchableOpacity
                    onPress={togglePasswordVisibility}
                    style={styles.icon}
                  >
                    <Ionicons
                      name={passwordVisible ? "eye-off" : "eye"}
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}

                <Button onPress={handleSubmit} title="Sign In" />
              </>
            )}
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    marginLeft: "auto",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default SignIn;
