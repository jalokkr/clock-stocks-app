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
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { getAllProducts } from "../api/productApi";
import { useSelector } from "react-redux";

export default function Stock() {
  const [products, setProducts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [refetchData, setRefetchData] = useState(false);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Stock</Text>
        {userData?.role === "admin" && (
          <Pressable style={styles.button}>
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
                  {/* <Text>
                    <Text style={styles.productCardLabel}>Price: </Text>
                    {item.price}
                  </Text> */}
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
    // iOS shadow properties
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Android elevation property
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
});
