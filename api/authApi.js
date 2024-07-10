import axios from "axios";

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
