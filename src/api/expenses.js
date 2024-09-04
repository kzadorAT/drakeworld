import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const getActiveExpenses = async () => {
  const response = await axios.get(`${API_URL}/expenses/active`, { headers: getAuthHeader() });
  return response.data;
};

export const getAllExpenses = async () => {
  const response = await axios.get(`${API_URL}/expenses/all`, { headers: getAuthHeader() });
  return response.data;
};

export const getExpenseById = async (id) => {
  const response = await axios.get(`${API_URL}/expenses/${id}`, { headers: getAuthHeader() });
  return response.data;
};

export const createExpense = async (expenseData) => {
  const response = await axios.post(`${API_URL}/expenses`, expenseData, { headers: getAuthHeader() });
  return response.data;
};

export const updateExpense = async (id, expenseData) => {
  const response = await axios.put(`${API_URL}/expenses/${id}`, expenseData, { headers: getAuthHeader() });
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await axios.delete(`${API_URL}/expenses/${id}`, { headers: getAuthHeader() });
  return response.data;
};
