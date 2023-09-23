import axios from 'axios';
import { API_URL, API_EMAIL, API_PASSWORD } from "@env";


const login = async () => {
  try {
    
    const response = await axios.post(`${API_URL}/login`, {
      email: API_EMAIL,
      password: API_PASSWORD,
    });        

    return response.data.data.token; 
  } catch (error) {
    console.log(error)
    throw error;     
  }
};

const getArticles = async (page) => {
  try {    
    console.log("oiii")    
    const token = await login();   
    console.log("page", page)
    const response = await axios.get(`${API_URL}/articles?page=${page}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("response", response.data)

    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getArticles };
