import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const getCreditCards = async () => {
  const response = await axios.get(`${API_URL}/creditCards`, { headers: getAuthHeader() });
  return response.data;
};

export const getCreditCardById = async (id) => {
  const response = await axios.get(`${API_URL}/creditCards/${id}`, { headers: getAuthHeader() });
  return response.data;
};

export const createCreditCard = async (cardData) => {
  const response = await axios.post(`${API_URL}/creditCards`, cardData, { headers: getAuthHeader() });
  return response.data;
};

export const updateCreditCard = async (id, cardData) => {
  const response = await axios.put(`${API_URL}/creditCards/${id}`, cardData, { headers: getAuthHeader() });
  return response.data;
};

export const deleteCreditCard = async (id) => {
  const response = await axios.delete(`${API_URL}/creditCards/${id}`, { headers: getAuthHeader() });
  return response.data;
};
