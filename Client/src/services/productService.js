import axiosInstance from '../api/axiosInstance';

export const getApprovedProducts = async () => {
  try {
    const response = await axiosInstance.get('/Products');
    return response.data;
  
  }
  catch (error) {
    console.error('Error fetching approved products:', error);
    throw error;
  }
};

export const getAllProducts = async () => {
  try {
    const response = await axiosInstance.get('/Customer/getallproduct');
    
    // Check if the response data is empty or invalid
    if (!response.data || response.data.length === 0) {
      console.warn('No products found in the response.');
      return []; // Return an empty array if no products are found
    }

    return response.data; // Return the valid response data
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error; // Re-throw the error for further handling
  }
};
