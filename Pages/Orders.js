import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { getAllOrders } from "../api/orderApi";
import { useSelector } from "react-redux";

export default function Orders() {
  const [orders, setOrders] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [refetchData, setRefetchData] = useState(false);
  const { userData } = useSelector((state) => state.auth);

  const fetchAllOrders = async () => {
    try {
      setIsLoading(true);
      const response = await getAllOrders();
      setOrders(response);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [refetchData]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Orders</Text>
        <Pressable style={styles.button}>
          <MaterialIcons name="add-shopping-cart" size={24} color="white" />
          <Text style={styles.buttonText}>Add Order</Text>
        </Pressable>
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
                    <Text style={styles.orderCardLabel}>Product Code: </Text>
                    {item.productCode}
                  </Text>
                  <Text>
                    <Text style={styles.orderCardLabel}>Quantity: </Text>
                    {item.quantity}
                  </Text>
                  <Text>
                    <Text style={styles.orderCardLabel}>Status: </Text>
                    {item.status}
                  </Text>
                </View>
              </View>
            )}
            keyExtractor={(item) => item._id}
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
});
