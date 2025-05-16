import axiosInstance from '../api/axiosInstance'; // تأكد من المسار الصحيح للملف

export const addToFavorite = async (customerId, productId) => {
  try {
    const response = await axiosInstance.post(`/AddToFavorite/${productId}`, {
      customerId,
      productId,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorite = async (customerId, productId) => {
  try {
    const response = await axiosInstance.delete(`/DeleteFromFavorite/${productId}`, {
      data: { customerId, productId },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

export const getFavorites = async (customerId) => {
  try {
    const response = await axiosInstance.get(`/favorites/${customerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};
