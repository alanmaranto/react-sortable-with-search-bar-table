import axios from "axios";
const url = "https://randomuser.me/api";

export const fetchData = async () => {
  try {
    const { data } = await axios.get(`${url}/?results=20`);
    return data.results;
  } catch (error) {
    throw new Error(error.message);
  }
};
