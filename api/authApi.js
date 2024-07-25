import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const signIn = async (email, password) => {
  const url = `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/users/login`;
  try {
    let response = await axios.post(url, { email, password });
    return response?.data;
  } catch (error) {
    console.error(error);
    return error?.response?.data;
  }
};

export const logOut = async () => {
  const token = await SecureStore.getItemAsync("user");
  const url = `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/users/logout`;
  try {
    let response = await axios.post(url, {
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
