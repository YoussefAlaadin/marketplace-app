import axiosInstance from '../axiosInstance';

export const addToCart = async (customerId, productId, quantity) => {
  try {
    const response = await axiosInstance.post(`AddToCart/${productId}/${quantity}`, {
      customerId,
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const removeFromCart = async (customerId, productId) => {
  try {
    const response = await axiosInstance.delete(`/cart/remove`, {
      data: { customerId, productId },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const getCart = async (customerId) => {
  try {
    const response = await axiosInstance.get(`/cart/${customerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};
