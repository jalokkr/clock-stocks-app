import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const getAllUsers = async () => {
  const token = await SecureStore.getItemAsync("user");

  const url = `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/users`;
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

export const addOneUser = async (body) => {
  const token = await SecureStore.getItemAsync("user");

  const url = `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/users`;
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