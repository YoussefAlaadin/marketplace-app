import axiosInstance from '../axiosInstance';

export const purchaseProducts = async (customerId) => {
  try {
    const response = await axiosInstance.post(`/Order`, { customerId });
    return response.data;
  } catch (error) {
    console.error('Error purchasing products:', error);
    throw error;
  }
};
