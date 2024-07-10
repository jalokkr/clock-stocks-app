import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  ActivityIndicator,
  TextInput,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import { AntDesign, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import { addOneUser, getAllUsers } from "../api/userApi";
import { Picker } from "@react-native-picker/picker";

export default function Users() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refetchData, setRefetchData] = useState(false);

  const handleFetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleFetchUsers();
  }, [refetchData]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>All Users</Text>
        <Pressable
          style={styles.button}
          onPress={() => {
            setIsModalOpen(true);
          }}
        >
          <AntDesign name="adduser" size={20} color="white" />
          <Text style={styles.buttonText}>Add User</Text>
        </Pressable>
      </View>
      <View style={styles.bodyContent}>
        {loading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <FlatList
            data={users}
            renderItem={({ item, index }) => (
              <View key={index} style={styles.userCard}>
                <View style={styles.userCardContent}>
                  <Text>
                    <Text style={styles.userCardLabel}>Sr. No: </Text>
                    {index + 1}
                  </Text>
                  <Text>
                    <Text style={styles.userCardLabel}>Name: </Text>
                    {item.name}
                  </Text>
                  <Text>
                    <Text style={styles.userCardLabel}>Email: </Text>
                    {item.email}
                  </Text>
                  <Text>
                    <Text style={styles.userCardLabel}>Phone: </Text>
                    {item.phone}
                  </Text>
                  <Text>
                    <Text style={styles.userCardLabel}>Shop: </Text>
                    {item.shop}
                  </Text>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Add New User</Text>
            <Formik
              initialValues={{
                name: "",
                email: "",
                phone: "",
                role: "",
                shop: "",
                password: "",
              }}
              validationSchema={Yup.object().shape({
                name: Yup.string().required("Name is required"),
                email: Yup.string()
                  .email("Invalid email")
                  .required("Email is required"),
                phone: Yup.string().required("Phone number is required"),
                role: Yup.string().required("Role is required"),
                shop: Yup.string().required("Shop is required"),
                password: Yup.string()
                  .min(6, "Password must be at least 6 characters")
                  .required("Password is required"),
              })}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const response = await addOneUser(values);
                  if (response?.id) {
                    setIsModalOpen(false);
                    setRefetchData(!refetchData);
                  } else {
                    Alert.alert(
                      "User Creation",
                      response?.error ||
                        "Congratulations ! User has been added in the system.",
                      [{ text: "OK" }],
                      { cancelable: false }
                    );
                  }
                } catch (err) {
                  console.log(err);
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
                isSubmitting,
                setFieldValue,
              }) => (
                <View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Name"
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      value={values.name}
                    />
                    {errors.name && touched.name && (
                      <Text style={styles.errorText}>{errors.name}</Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Email"
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                      keyboardType="email-address"
                    />
                    {errors.email && touched.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Phone number</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Number"
                      onChangeText={handleChange("phone")}
                      onBlur={handleBlur("phone")}
                      value={values.phone}
                      keyboardType="numeric"
                    />
                    {errors.phone && touched.phone && (
                      <Text style={styles.errorText}>{errors.phone}</Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Role</Text>
                    <Picker
                      selectedValue={values.role}
                      onValueChange={(itemValue) =>
                        setFieldValue("role", itemValue)
                      }
                      style={styles.input}
                    >
                      <Picker.Item label="Select Role" value="" />
                      <Picker.Item label="Admin" value="admin" />
                      <Picker.Item label="User" value="user" />
                    </Picker>
                    {errors.role && touched.role && (
                      <Text style={styles.errorText}>{errors.role}</Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Shop</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Shop"
                      onChangeText={handleChange("shop")}
                      onBlur={handleBlur("shop")}
                      value={values.shop}
                    />
                    {errors.shop && touched.shop && (
                      <Text style={styles.errorText}>{errors.shop}</Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Password"
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      secureTextEntry
                    />
                    {errors.password && touched.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}
                  </View>
                  <View style={styles.buttonContainer}>
                    <Pressable
                      style={[styles.modalButton, styles.buttonClose]}
                      onPress={handleSubmit}
                      disabled={isSubmitting}
                    >
                      <FontAwesome6 name="add" size={20} color="white" />
                      <Text style={styles.buttonText}>Add User</Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.modalButton,
                        styles.buttonClose,
                        styles.rightButton,
                      ]}
                      onPress={() => setIsModalOpen(!isModalOpen)}
                    >
                      <FontAwesome name="close" size={20} color="white" />
                      <Text style={styles.buttonText}>Close</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
  },
  button: {
    height: 50,
    borderRadius: 6,
    width: 120,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#007bff",
    paddingHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    paddingLeft: 5,
  },
  bodyContent: {
    padding: 10,
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  userCard: {
    width: 300,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    margin: 15,
    backgroundColor: "#fff",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  userCardContent: {
    display: "flex",
    flexDirection: "column",
  },
  userCardLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  inputContainer: {
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingLeft: 10,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 25,
  },
  modalButton: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonClose: {
    backgroundColor: "blue",
  },
  rightButton: {
    marginLeft: 20,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});
