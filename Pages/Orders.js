import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import {
  MaterialIcons,
  AntDesign,
  FontAwesome,
  FontAwesome6,
} from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  getAllOrders,
  approveOneOrder,
  rejectOneOrder,
  addOneOrder,
} from "../api/orderApi";
import { useSelector } from "react-redux";
import { getAllProducts } from "../api/productApi";
import { Picker } from "@react-native-picker/picker";

export default function Orders() {
  const [orders, setOrders] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [refetchData, setRefetchData] = useState(false);
  const { userData } = useSelector((state) => state.auth);
  const userId = userData?._id;
  const [products, setAllProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <MaterialIcons name="pending-actions" size={14} color="yellow" />
        );
      case "approved":
        return <MaterialIcons name="approval" size={14} color="green" />;
      case "rejected":
        return <MaterialIcons name="block" size={14} color="red" />;
      default:
        return null;
    }
  };

  const handleApprove = async (orderId) => {
    try {
      await approveOneOrder(orderId);
      setRefetchData(!refetchData);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async (orderId) => {
    try {
      await rejectOneOrder(orderId);
      setRefetchData(!refetchData);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllOrdersAndProducts = async () => {
    try {
      setIsLoading(true);
      const response = await getAllOrders();
      const productsResponse = await getAllProducts();
      setAllProducts(productsResponse?.products);
      setOrders(response);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrdersAndProducts();
  }, [refetchData]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Orders</Text>
        {userData?.role === "user" && (
          <Pressable style={styles.button} onPress={() => setIsModalOpen(true)}>
            <MaterialIcons name="add-shopping-cart" size={24} color="white" />
            <Text style={styles.buttonText}>Add Order</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.metricCard}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Total Orders</Text>
          <Text style={styles.metricValue}>{orders?.metrics?.totalOrders}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Total Approved</Text>
          <Text style={styles.metricValue}>
            {orders?.metrics?.totalApproved}
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Total Pending</Text>
          <Text style={styles.metricValue}>
            {orders?.metrics?.totalPending}
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Total Rejected</Text>
          <Text style={styles.metricValue}>
            {orders?.metrics?.totalRejected}
          </Text>
        </View>
      </View>
      <View style={styles.bodyContent}>
        {isLoading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <FlatList
            data={orders?.orders}
            renderItem={({ item, index }) => (
              <View key={index} style={styles.orderCard}>
                <View style={styles.orderCardContent}>
                  <Text>
                    <Text style={styles.orderCardLabel}>Sr. No: </Text>
                    {index + 1}
                  </Text>
                  <Text>
                    <Text style={styles.orderCardLabel}>Order Name: </Text>
                    {item.name}
                  </Text>

                  <Text>
                    <Text style={styles.orderCardLabel}>Quantity: </Text>
                    {item.quantity}
                  </Text>
                  <Text>
                    <Text style={styles.orderCardLabel}>Status: </Text>
                    {item.status}
                    {getStatusIcon(item?.status)}
                  </Text>
                </View>
                {(item.status.toLowerCase() === "pending" && userData?.role === "admin") && (
                  <View style={styles.actionButtons}>
                    <Pressable
                      style={[styles.actionButton, styles.approveButton]}
                      onPress={() => handleApprove(item._id)}
                    >
                      <AntDesign name="checkcircle" size={24} color="white" />
                    </Pressable>
                    <Pressable
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => handleReject(item._id)}
                    >
                      <AntDesign name="closecircle" size={24} color="white" />
                    </Pressable>
                  </View>
                )}
              </View>
            )}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.flatListContent}
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
            <Text style={styles.modalText}>Add New Order</Text>
            <Formik
              initialValues={{
                name: "",
                product: "",
                quantity: "",
                price: "",
                comment: "",
                status: "pending",
                user: userId,
              }}
              validationSchema={Yup.object().shape({
                name: Yup.string().required("Order name is required"),
                product: Yup.string().required("Product is required"),
                quantity: Yup.string().required("Quantity is required"),
                price: Yup.string().required("Price is required"),
                comment: Yup.string(),
              })}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const response = await addOneOrder(values);
                  if (response?._id) {
                    setIsModalOpen(false);
                    setRefetchData(!refetchData);
                  } else {
                    Alert.alert(
                      "Order Creation",
                      response?.error ||
                        "Congratulations! Order has been added in the system.",
                      [{ text: "OK" }],
                      { cancelable: false }
                    );
                  }
                } catch (err) {
                  console.log(err);
                }
                setSubmitting(false);
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
                    <Text style={styles.inputLabel}>Order Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Order Name"
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      value={values.name}
                    />
                    {errors.name && touched.name && (
                      <Text style={styles.errorText}>{errors.name}</Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Product</Text>
                    <Picker
                      selectedValue={values.product}
                      onValueChange={(itemValue) =>
                        setFieldValue("product", itemValue)
                      }
                      style={styles.input}
                    >
                      <Picker.Item label="Select Product" value="" />
                      {products.map((product) => (
                        <Picker.Item
                          key={product._id}
                          label={product.name}
                          value={product._id}
                        />
                      ))}
                    </Picker>
                    {errors.product && touched.product && (
                      <Text style={styles.errorText}>{errors.product}</Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Quantity</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Quantity"
                      onChangeText={handleChange("quantity")}
                      onBlur={handleBlur("quantity")}
                      value={values.quantity}
                      keyboardType="numeric"
                    />
                    {errors.quantity && touched.quantity && (
                      <Text style={styles.errorText}>{errors.quantity}</Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Price</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Price"
                      onChangeText={handleChange("price")}
                      onBlur={handleBlur("price")}
                      value={values.price}
                      keyboardType="numeric"
                    />
                    {errors.price && touched.price && (
                      <Text style={styles.errorText}>{errors.price}</Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Comment</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Comment"
                      onChangeText={handleChange("comment")}
                      onBlur={handleBlur("comment")}
                      value={values.comment}
                    />
                    {errors.comment && touched.comment && (
                      <Text style={styles.errorText}>{errors.comment}</Text>
                    )}
                  </View>
                  <View style={styles.buttonContainer}>
                    <Pressable
                      style={[styles.modalButton, styles.buttonClose]}
                      onPress={handleSubmit}
                      disabled={isSubmitting}
                    >
                      <FontAwesome6 name="add" size={20} color="white" />
                      <Text style={styles.buttonText}>Add Order</Text>
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
    flex: 1,
    padding: 10,
  },
  orderCard: {
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
  orderCardContent: {
    display: "flex",
    flexDirection: "column",
  },
  orderCardLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  actionButton: {
    padding: 10,
    borderRadius: 5,
  },
  approveButton: {
    backgroundColor: "green",
  },
  rejectButton: {
    backgroundColor: "red",
  },
  flatListContent: {
    paddingBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
    fontSize: 18,
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    width: 250,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginTop: 5,
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
