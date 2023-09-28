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
    const token = await login();   
    console.log("page", page)
    const response = await axios.get(`${API_URL}/articles?page=${page}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const getCategories = async (page) => {
  try {    
    
    const token = await login();   
    
    const response = await axios.get(`${API_URL}/categories?page=${page}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const getPlants = async (page, query, category_id) => {
  try {    
    
    const token = await login();   
    console.log("page", page)
    console.log("query", query)
    console.log("category_id", category_id)
    
    let url = `${API_URL}/plants?page=${page}`
    if (query){
      url = url + `&category_name=${query}&name=${query}&scientific_name=${query}`
    }
    if (category_id){
      url = url + `&category_id=${category_id}`
    }
    console.log("url", url)
    const response = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllCategories = async () => {
  try {    
    
    const token = await login();   
    
    const response = await axios.get(`${API_URL}/categoriesAll`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getArticles, getCategories, getPlants, getAllCategories };
