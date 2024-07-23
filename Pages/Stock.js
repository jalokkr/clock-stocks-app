import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  TextInput,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import { Entypo, FontAwesome6, FontAwesome } from "@expo/vector-icons";
import { getAllProducts, addOneProduct } from "../api/productApi";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";

export default function Stock() {
  const [products, setProducts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [refetchData, setRefetchData] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userData } = useSelector((state) => state.auth);

  const fetchAllProducts = async () => {
    try {
      setIsLoading(true);
      const response = await getAllProducts();
      setProducts(response);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, [refetchData]);

  const handleAddProduct = async (values, { setSubmitting }) => {
    try {
      const response = await addOneProduct(values);
      if (response) {
        setIsModalOpen(false);
        setRefetchData(!refetchData);
        Alert.alert("Success", "Product added successfully", [{ text: "OK" }]);
      } else {
        Alert.alert("Error", "Failed to add product", [{ text: "OK" }]);
      }
      setSubmitting(false);
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      Alert.alert("Error", "Failed to add product", [{ text: "OK" }]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Stock</Text>
        {userData?.role === "admin" && (
          <Pressable style={styles.button} onPress={() => setIsModalOpen(true)}>
            <Entypo name="add-to-list" size={24} color="white" />
            <Text style={styles.buttonText}>Add Stock</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.metricCard}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Total Product Category</Text>
          <Text style={styles.metricValue}>
            {products?.metrics?.totalProductCategory}
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Total Product Quantity</Text>
          <Text style={styles.metricValue}>
            {products?.metrics?.totalProductQuantity}
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>
            Total Product Quantity Consumed
          </Text>
          <Text style={styles.metricValue}>
            {products?.metrics?.totalProductQuantityConsumed}
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>
            Total Product Quantity Remaining
          </Text>
          <Text style={styles.metricValue}>
            {products?.metrics?.totalProductQuantityRemaining}
          </Text>
        </View>
      </View>
      <View style={styles.bodyContent}>
        {isLoading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <FlatList
            data={products?.products}
            renderItem={({ item, index }) => (
              <View key={index} style={styles.productCard}>
                <View style={styles.productCardContent}>
                  <Text>
                    <Text style={styles.productCardLabel}>Sr. No: </Text>
                    {index + 1}
                  </Text>
                  <Text>
                    <Text style={styles.productCardLabel}>Product Name: </Text>
                    {item.name}
                  </Text>
                  <Text>
                    <Text style={styles.productCardLabel}>
                      Product Category:{" "}
                    </Text>
                    {item.category}
                  </Text>
                  <Text>
                    <Text style={styles.productCardLabel}>Product Code: </Text>
                    {item.code}
                  </Text>
                  <Text>
                    <Text style={styles.productCardLabel}>
                      Product Quantity:{" "}
                    </Text>
                    {item.quantity}
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
            <Text style={styles.modalText}>Add New Product</Text>
            <Formik
              initialValues={{
                name: "",
                type: "",
                code: "",
                category: "",
                quantity: "",
                price: "",
                comment: "",
              }}
              validationSchema={Yup.object().shape({
                name: Yup.string().required("Name is required"),
                type: Yup.string().required("Type is required"),
                code: Yup.string().required("Code is required"),
                category: Yup.string().required("Category is required"),
                quantity: Yup.string().required("Quantity is required"),
                price: Yup.string().required("Price is required"),
                comment: Yup.string(),
              })}
              onSubmit={handleAddProduct}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
              }) => (
                <View>
                  {[
                    { label: "Name", name: "name", placeholder: "Enter Name" },
                    { label: "Type", name: "type", placeholder: "Enter Type" },
                    { label: "Code", name: "code", placeholder: "Enter Code" },
                    {
                      label: "Category",
                      name: "category",
                      placeholder: "Enter Category",
                    },
                    {
                      label: "Quantity",
                      name: "quantity",
                      placeholder: "Enter Quantity",
                    },
                    {
                      label: "Price",
                      name: "price",
                      placeholder: "Enter Price",
                    },
                    {
                      label: "Comment",
                      name: "comment",
                      placeholder: "Enter Comment",
                    },
                  ].map((field, index) => (
                    <View key={index} style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>{field.label}</Text>
                      <TextInput
                        style={styles.input}
                        placeholder={field.placeholder}
                        onChangeText={handleChange(field.name)}
                        onBlur={handleBlur(field.name)}
                        value={values[field.name]}
                      />
                      {errors[field.name] && touched[field.name] && (
                        <Text style={styles.errorText}>
                          {errors[field.name]}
                        </Text>
                      )}
                    </View>
                  ))}
                  <View style={styles.buttonContainer}>
                    <Pressable
                      style={[styles.modalButton, styles.buttonClose]}
                      onPress={handleSubmit}
                      disabled={isSubmitting}
                    >
                      <FontAwesome6 name="add" size={20} color="white" />
                      <Text style={styles.buttonText}>Add Product</Text>
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
    width: 150,
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
  metricCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  metricItem: {
    marginBottom: 20,
  },
  metricLabel: {
    fontSize: 16,
    color: "#555",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  bodyContent: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  productCard: {
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
  productCardContent: {
    display: "flex",
    flexDirection: "column",
  },
  productCardLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    width: 250,
  },
  errorText: {
    fontSize: 14,
    color: "red",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  buttonClose: {
    backgroundColor: "blue",
  },
  rightButton: {
    backgroundColor: "blue",
  },
  buttonText: {
    color: "white",
    marginLeft: 5,
  },
});
