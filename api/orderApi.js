import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const getAllOrders = async () => {
  const token = await SecureStore.getItemAsync("user");

  const url = `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/orders`;
  try {
    let response = await axios.get(url, {
      headers: {
        authorization: `${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    console.error(error);
    return error?.response?.data;
  }
};

export const addOneOrder = async (body) => {
  const token = await SecureStore.getItemAsync("user");

  const url = `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/orders`;
  try {
    let response = await axios.post(url, body, {
      headers: {
        authorization: `${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    console.error(error);
    return error?.response?.data;
  }
};

export const approveOneOrder = async (id) => {
  const token = await SecureStore.getItemAsync("user");
  const url = `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/orders/${id}/approve`;
  try {
    let response = await axios.post(
      url,
      {},
      {
        headers: {
          authorization: `${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.error(error);
    return error?.response?.data;
  }
};

export const rejectOneOrder = async (id) => {
  const token = await SecureStore.getItemAsync("user");

  const url = `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/orders/${id}/reject`;
  try {
    let response = await axios.post(
      url,
      {},
      {
        headers: {
          authorization: `${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.error(error);
    return error?.response?.data;
  }
};
