import axios from 'axios';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com/users';

export const userService = {
  
  getAllUsers: async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  },

  
  getUserById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user with ID ${id}`);
    }
  },

  
  createUser: async (userData) => {
    try {
      const response = await axios.post(API_BASE_URL, userData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create user');
    }
  },

  
  updateUser: async (id, userData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update user with ID ${id}`);
    }
  },

  
  deleteUser: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete user with ID ${id}`);
    }
  }
};